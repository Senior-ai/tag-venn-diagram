<?php
/*
Plugin Name: Tag Venn Diagram
Description: Creates a shortcode to display a Venn diagram of post tags using amCharts
Version: 1.6
Author: Shon Aizenshtein
*/

function tvd_enqueue_scripts()
{
    wp_enqueue_script('amcharts-core', 'https://cdn.amcharts.com/lib/5/index.js', array(), null, true);
    wp_enqueue_script('amcharts-venn', 'https://cdn.amcharts.com/lib/5/venn.js', array('amcharts-core'), null, true);
    wp_enqueue_script('amcharts-themes', 'https://cdn.amcharts.com/lib/5/themes/Animated.js', array('amcharts-core'), null, true);
    wp_enqueue_script('tag-venn-script', plugin_dir_url(__FILE__) . 'tag-venn.js', array('amcharts-venn'), '1.6', true);
    wp_enqueue_style('tag-venn-style', plugin_dir_url(__FILE__) . 'tag-venn.css', array(), '1.6');
}
add_action('wp_enqueue_scripts', 'tvd_enqueue_scripts');

function tvd_venn_diagram_shortcode()
{
    $tags = get_tags(array('hide_empty' => true, 'number' => 5, 'orderby' => 'count', 'order' => 'DESC'));
    $data = array();

    // Add individual tag data
    foreach ($tags as $tag) {
        $data[] = array(
            "name" => $tag->name,
            "value" => $tag->count
        );
    }

    // Calculate and add intersections
    for ($i = 0; $i < count($tags); $i++) {
        for ($j = $i + 1; $j < count($tags); $j++) {
            $intersection = tvd_get_intersection_count($tags[$i]->term_id, $tags[$j]->term_id);
            if ($intersection > 0) {
                $data[] = array(
                    "name" => $tags[$i]->name . " & " . $tags[$j]->name,
                    "sets" => array($tags[$i]->name, $tags[$j]->name),
                    "value" => $intersection
                );
            }
        }
    }

    wp_localize_script('tag-venn-script', 'tagVennData', array('data' => $data));

    return '<div id="venn-diagram" style="width: 100%; height: 500px;"></div>';
}
add_shortcode('tag_venn_diagram', 'tvd_venn_diagram_shortcode');

function tvd_get_intersection_count($tag1_id, $tag2_id)
{
    global $wpdb;
    $query = $wpdb->prepare(
        "SELECT COUNT(DISTINCT p1.object_id) FROM {$wpdb->term_relationships} p1
        INNER JOIN {$wpdb->term_relationships} p2 ON p1.object_id = p2.object_id
        WHERE p1.term_taxonomy_id = %d AND p2.term_taxonomy_id = %d",
        $tag1_id,
        $tag2_id
    );
    return intval($wpdb->get_var($query));
}