// @ts-nocheck

import React, { useContext } from "react";
import update from "immutability-helper";
import interact from "interactjs";

import {
  Chart,
  InteractionOptions,
  ChartOperationsContextObject,
  ChartOperationsProviderArgs,
} from "./types";

const ChartOperationsContext =
  React.createContext<ChartOperationsContextObject>({
    setComponentFields: () => {},
    setSelectedComponent: () => {},
    setInteractions: () => "",
    getChartTable: () => [],
    selectedComponentId: null,
  });

export function ChartOperationsProvider(args: ChartOperationsProviderArgs) {
  const { chart, setChart, renderForEditor } = args;

  const setComponentFields = (componentId: string, setters: any): void => {
    // Need to use functional update style otherwise consecutive
    // calls will conflict and changes will be lost
    setChart((prevChart: Chart) =>
      update(prevChart, {
        componentsById: {
          [componentId]: {
            config: setters,
          },
        },
      })
    );
  };

  const setInteractions = (
    componentId: string,
    options: InteractionOptions
  ): string => {
    if (!renderForEditor) {
      return;
    }

    const component = chart.componentsById[componentId];
    const interactClass = `interact-${component.id}`;
    const { xField, yField } = options.drag;

    interact(`.${interactClass}`).resizable({
      margin: 30,
      edges: { top: true, left: true, bottom: true, right: true },
      listeners: {
        move(event) {
          const x =
            component.config[xField] +
            event.deltaRect.left / 2 -
            event.deltaRect.right / 2;
          const y =
            component.config[yField] +
            event.deltaRect.top / 2 -
            event.deltaRect.bottom / 2;

          setComponentFields(componentId, {
            [xField]: {
              $set: x,
            },
            [yField]: {
              $set: y,
            },
            width: {
              $set: parseInt(event.rect.width, 10),
            },
            height: {
              $set: parseInt(event.rect.height, 10),
            },
          });
        },
      },
      modifiers: [
        // keep the edges inside the parent
        // interact.modifiers.restrictEdges({
        //   outer: "parent",
        // }),

        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 },
        }),
      ],
      inertia: false,
    });

    if (component.type === "Group") {
      interact(`.${interactClass}`).draggable({
        listeners: {
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: "parent",
              endOnly: true,
            }),
          ],
          move(event) {
            setComponentFields(component.id, {
              [xField]: {
                $set: Math.round(component.config[xField] + event.dx),
              },
              [yField]: {
                $set: Math.round(component.config[yField] + event.dy),
              },
            });
          },
        },
      });
    }

    return interactClass;
  };

  const setSelectedComponent = (componentId: string | null) => {
    setChart({
      ...chart,
      selectedComponentId: componentId,
    });
  };

  const selectedComponentId = chart.selectedComponentId;

  const getChartTable = () => chart.table;

  const context = {
    setComponentFields,
    setInteractions,
    setSelectedComponent,
    getChartTable,
    selectedComponentId,
  };
  const { children } = args;

  return (
    <ChartOperationsContext.Provider value={context}>
      {children}
    </ChartOperationsContext.Provider>
  );
}

export function useChartOps(): ChartOperationsContextObject {
  return useContext(ChartOperationsContext);
}
