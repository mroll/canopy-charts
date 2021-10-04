// @ts-nocheck

import React, { useEffect, useRef } from "react";
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

  const { minX, minY, maxX, maxY } = bb;
  // return { width: maxX - minX, height: maxY - minY };

  return { width, height };
};

function BaseChartForEditor(props: any) {
  const { chart, children, textComponents, renderForEditor, showTitle } = props;
  const { setTextHeight, setInteractions, setSelectedComponent } =
    useChartOps();
  const textRef = useRef(null);

  const onChartClick = (e: any) => {
    const groupId = Object.keys(chart.componentsById).find((componentId) => {
      return chart.componentsById[componentId].type === "Group";
    });

    if (groupId) {
      setSelectedComponent(groupId);
    }
  };

  const primaryGroup = Object.values(chart.componentsById).find(
    (component: any) => component.type === "Group"
  ) as ChartComponentT;
  const container = Object.values(chart.componentsById).find(
    (component: any) => component.type === "Container"
  );

  const interactClass = container
    ? setInteractions(container.id, {
        drag: {
          xField: "left",
          yField: "top",
        },
      })
    : "";

  useEffect(() => {
    if (textRef.current) {
      setTextHeight(textRef.current.clientHeight);
    }
  }, []);

  return primaryGroup && container ? (
    <div
      className={interactClass}
      style={{
        position: "absolute",
        backgroundColor: container.config.fill,
        width: container.config.width,
        height: container.config.height,
        top: container.config.top,
        left: container.config.left,
        paddingLeft: container.config.margin.l,
        paddingRight: container.config.margin.r,
        paddingTop: container.config.margin.t,
        paddingBottom: container.config.margin.b,
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{ width: "100%", height: "100%" }}
        onClick={onChartClick}
      >
        {children}
      </svg>
    </div>
  ) : null;
}

function BaseChartForRemoteApp(props: any) {
  const {
    children,
    textComponents,
    chart,
    width,
    height,
    renderForEditor,
    showTitle,
  } = props;

  const vb = viewBox(chart, width, height);

  return (
    <div className="">
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
      <svg width="100%" height="100%" viewBox={`0 0 ${vb.width} ${vb.height}`}>
        {children}
      </svg>
    </div>
  );
}

function CanopyBaseChart(props: any) {
  const { chart, setChart, renderForEditor, width, height, showTitle } = props;

  const BaseChartComponent = renderForEditor
    ? BaseChartForEditor
    : BaseChartForRemoteApp;

  const textComponents = chart.componentsArray.filter(
    (id: string) =>
      chart.componentsById[id].type !== "Container" &&
      chart.componentsById[id].type === "DynamicText"
  );
  const svgComponents = chart.componentsArray.filter(
    (id: string) =>
      chart.componentsById[id].type !== "Container" &&
      chart.componentsById[id].type !== "DynamicText"
  );

  return (
    <ParentSize>
      {(parent) => (
        <ChartOperationsProvider
          chart={chart}
          setChart={setChart || noop}
          renderForEditor={renderForEditor}
          width={width || parent.width}
          height={height || parent.height}
        >
          <BaseChartComponent
            chart={chart}
            renderForEditor={renderForEditor}
            textComponents={textComponents}
            width={width || parent.width}
            height={height || parent.height}
            showTitle={showTitle}
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
          </BaseChartComponent>
        </ChartOperationsProvider>
      )}
    </ParentSize>
  );
}

export default CanopyBaseChart;
