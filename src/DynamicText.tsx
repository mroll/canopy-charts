import React from "react";
import { useChartOps } from "./ChartOperations";
import { ChartComponent } from "./types";

function RenderDynamicText(props: any) {
  const { id, config, children } = props;
  const { font, display, margin, color, innerText } = config;
  const { getComponents } = useChartOps();

  const childComponents = getComponents(children);

  return (
    <div
      style={{
        fontFamily: font.family,
        fontSize: font.size,
        fontWeight: font.weight,
        color: color,
        display: display.display,
        flexDirection: display.flexDirection,
        justifyContent: display.justifyContent,
        alignItems: display.alignItems,
        marginTop: margin.t,
        marginBottom: margin.b,
        marginLeft: margin.l,
        marginRight: margin.r,
      }}
    >
      {childComponents.length > 0
        ? childComponents.map((child: ChartComponent) => (
            <RenderDynamicText
              key={child.id}
              id={child.id}
              config={child.config}
              children={child.children}
            />
          ))
        : innerText}
    </div>
  );
}

export default RenderDynamicText;
