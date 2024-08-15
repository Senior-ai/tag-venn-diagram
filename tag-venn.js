document.addEventListener("DOMContentLoaded", function () {
  am5.ready(function () {
    var root = am5.Root.new("venn-diagram");
    root.setThemes([am5themes_Animated.new(root)]);

    var container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout,
      })
    );

    var series = container.children.push(
      am5venn.Venn.new(root, {
        categoryField: "name",
        valueField: "value",
        intersectionsField: "sets",
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 40,
        paddingRight: 40,
      })
    );

    // Adjust label positioning for Hebrew
    series.labels.template.setAll({
      fontSize: 12,
      fill: am5.color(0x000000),
      text: "{category}",
      centerX: am5.percent(50),
      centerY: am5.percent(50),
      populateText: true,
      direction: "rtl",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
    });

    // Improve label readability
    series.slices.template.setAll({
      fillOpacity: 0.6,
      strokeWidth: 2,
      strokeOpacity: 1,
      stroke: am5.color(0xffffff),
    });

    series.slices.template.states.create("hover", {
      fillOpacity: 0.8,
      strokeWidth: 3,
      stroke: am5.color(0x000000),
    });

    // Set data
    series.data.setAll(tagVennData.data);

    // Add legend with adjusted positioning for Hebrew
    var legend = container.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
        layout: root.horizontalLayout,
        height: 50,
        verticalScrollbar: am5.Scrollbar.new(root, {
          orientation: "vertical",
        }),
      })
    );

    // Adjust legend labels for Hebrew
    legend.labels.template.setAll({
      fontSize: 14,
      fontWeight: "500",
      fontFamily: "Arial, sans-serif",
      direction: "rtl",
      textAlign: "right",
      paddingRight: 5,
    });

    legend.data.setAll(series.dataItems);

    // Custom tooltip for RTL support
    series.slices.template.set(
      "tooltip",
      am5.Tooltip.new(root, {
        labelText: "[direction:rtl]{name}: {value}",
        getFillFromSprite: false,
        autoTextColor: false,
      })
    );

    // Style the tooltip
    series.slices.template.get("tooltip").label.setAll({
      fill: am5.color(0x000000),
      fontFamily: "Arial, sans-serif",
      fontSize: 14,
      fontWeight: "500",
    });

    // Adjust tooltip positioning
    series.slices.template.get("tooltip").set("dx", 0);
    series.slices.template.get("tooltip").set("dy", 0);

    // Make stuff animate on load
    series.appear(1000, 100);

    // Adjust layout after everything is set up
    root.events.on("frameended", function () {
      legend.markDirtyValues();
    });
  });
});
