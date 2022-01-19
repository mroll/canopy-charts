// @ts-nocheck

import React, { forwardRef, useEffect, useRef } from "react";
import { ParentSize } from "@visx/responsive";
import interact from "interactjs";

import ChartComponent from "./ChartComponent";
import { ChartOperationsProvider } from "./ChartOperations";
import { Chart, ChartComponent as ChartComponentT } from "./types";
import { useChartOps } from "./ChartOperations";

interface ViewBox {
  width: number;
  height: number;
}

const noop = () => {};

const viewBox = (chart: Chart, width: number, height: number): ViewBox => {
  const primaryGroup = Object.values(chart.componentsById).find(
    (component: any) => component.type === "Group"
  ) as ChartComponentT;

  const bb = {
    minX: primaryGroup.config.left as number,
    minY: primaryGroup.config.top as number,
    maxX:
      (primaryGroup.config.left as number) +
      (primaryGroup.config.width as number),
    maxY:
      (primaryGroup.config.top as number) +
      (primaryGroup.config.height as number),
  };

  return { width, height };
};

export const BaseSvg = (props: any) => {
  const { chart, renderForEditor, width, height } = props;

  const svgComponents = chart.componentsArray.filter(
    (id: string) =>
      chart.componentsById[id].type !== "Container" &&
      chart.componentsById[id].type !== "Text"
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ width: "100%", height: "100%" }}
      viewBox={renderForEditor ? null : `0 0 ${width} ${height}`}
    >
      {svgComponents.map((componentId: string) => (
        <ChartComponent
          key={componentId}
          table={chart.table}
          componentsById={chart.componentsById}
          renderForEditor={renderForEditor}
          {...chart.componentsById[componentId]}
        />
      ))}
    </svg>
  );
};

const BaseChartForEditor = forwardRef((props: any, ref) => {
  const { chart, renderForEditor, showTitle, width } = props;
  const { setTextHeight, setInteractions, computedChartHeight } = useChartOps();
  const textRef = useRef(null);

  const vb = renderForEditor
    ? {}
    : viewBox(chart, width, computedChartHeight());

  const primaryGroup = Object.values(chart.componentsById).find(
    (component: any) => component.type === "Group"
  ) as ChartComponentT;
  const container = Object.values(chart.componentsById).find(
    (component: any) => component.type === "Container"
  );

  useEffect(() => {
    if (textRef.current) {
      setTextHeight(textRef.current.clientHeight);
    }
  }, []);

  if (!container) {
    return null;
  }

  const interactClass = renderForEditor
    ? setInteractions(container.id, {
        drag: {
          xField: "left",
          yField: "top",
        },
      })
    : "";

  const textComponents = chart.componentsArray.filter(
    (id: string) =>
      chart.componentsById[id].type !== "Container" &&
      chart.componentsById[id].type === "Text"
  );

  const { offsetX, offsetY, blurRadius, fill } = container.config.boxShadow;
  return primaryGroup ? (
    <div
      id={`chart-${chart.id}`}
      ref={ref}
      className={`chart-container ${interactClass}`}
      style={{
        position: renderForEditor ? "absolute" : null,
        backgroundColor: container.config.fill,
        width: renderForEditor ? container.config.width : null,
        height: renderForEditor ? container.config.height : null,
        top: container.config.top,
        left: container.config.left,
        paddingLeft: container.config.margin.l,
        paddingRight: container.config.margin.r,
        paddingTop: container.config.margin.t,
        paddingBottom: container.config.margin.b,
        borderRadius: container.config.rx,
        boxShadow: container.config.showBoxShadow
          ? `${offsetX}px ${offsetY}px ${blurRadius}px ${fill}`
          : undefined,
      }}
    >
      <div ref={textRef}>
        {showTitle &&
          textComponents.map((componentId: string) => (
            <ChartComponent
              key={componentId}
              table={chart.table}
              componentsById={chart.componentsById}
              renderForEditor={renderForEditor}
              {...chart.componentsById[componentId]}
            />
          ))}
      </div>
      <BaseSvg
        chart={chart}
        renderForEditor={renderForEditor}
        width={vb.width}
        height={vb.height}
      />
    </div>
  ) : null;
});

const CanopyBaseChart = forwardRef((props: any, ref) => {
  const {
    chart,
    setChart,
    renderForEditor,
    width,
    height,
    showTitle,
    svgOnly,
  } = props;

  const BaseChartComponent = true ? BaseChartForEditor : BaseChartForRemoteApp;

  return (
    <ParentSize>
      {(parent) => {
        return (
          <ChartOperationsProvider
            chart={chart}
            setChart={setChart || noop}
            renderForEditor={renderForEditor}
            width={width || parent.width}
            height={height || parent.height}
          >
            {svgOnly ? (
              <BaseSvg
                chart={chart}
                width={width}
                height={height}
                renderForEditor={renderForEditor}
              />
            ) : (
              <BaseChartComponent
                chart={chart}
                ref={ref}
                renderForEditor={renderForEditor}
                width={width || parent.width}
                height={height || parent.height}
                showTitle={showTitle}
              />
            )}
          </ChartOperationsProvider>
        );
      }}
    </ParentSize>
  );
});

export default CanopyBaseChart;
