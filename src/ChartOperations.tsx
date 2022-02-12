// @ts-nocheck

import React, { useContext } from "react";
import update from "immutability-helper";
import interact from "interactjs";

import {
  Chart,
  InteractionOptions,
  ChartOperationsContextObject,
  ChartOperationsProviderArgs,
  TableData,
  ColumnSelector,
} from "./types";
import { dataService } from "./DataService";

const ChartOperationsContext =
  React.createContext<ChartOperationsContextObject>({
    setComponentFields: () => {},
    setSelectedComponent: () => {},
    setInteractions: () => "",
    getChartTable: () => [],
    getXColumns: () => [],
    getYColumns: () => [],
    getChartDimensions: () => {},
    selectedComponentId: null,
  });

export function ChartOperationsProvider(args: ChartOperationsProviderArgs) {
  const { chart, setChart, renderForEditor, width, height } = args;

  const fetchRemoteTable = async (): Promise<void> => {
    if (chart.id === "-1" || chart.remoteColumns.length === 0) {
      return;
    }

    // what even is this
    // this must get cleaned up. must.
    const distinctColumns = Object.values(chart.remoteColumns).map(
      (field2ColSelector) => {
        const cmpColSelectors = (
          colSelector1: ColumnSelector,
          colSelector2: ColumnSelector
        ) => {
          return (
            `${colSelector1.collection}/${colSelector1.name}` <
            `${colSelector2.collection}/${colSelector2.name}`
          );
        };
        return Object.values(field2ColSelector)
          .sort(cmpColSelectors)
          .reduce((acc, colSelector) => {
            const lastColSelector = acc[acc.length - 1];
            const colSelectorsEqual =
              `${lastColSelector.collection}/${lastColSelector.name}` ===
              `${colSelector.collection}/${colSelector.name}`;

            if (colSelectorsEqual) {
              return acc;
            }

            return [...acc, colSelector];
          });
      }
    );

    const remoteTable = await dataService.remoteTable(
      chart.id,
      distinctColumns
    );

    setChart({
      ...chart,
      remoteTable,
    });
  };

  const computedChartHeight = () => {
    const container = getContainer();

    return Math.max(
      (height || 0) -
        (chart.textHeight || 0) -
        ((container && container.config.margin.t) || 0) -
        ((container && container.config.margin.b) || 0),
      0
    );
  };

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
          const x = component.config[xField] + event.deltaRect.left;
          const y = component.config[yField] + event.deltaRect.top;

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

          if (component.type === "Container") {
            const container = component;
            const primaryGroup = Object.values(chart.componentsById).find(
              (component: any) => component.type === "Group"
            ) as ChartComponentT;

            const textHeight = chart.textHeight;
            const computedGroupWidth = container
              ? (container.config.width as number) -
                ((container.config.margin as { [key: string]: number })
                  .l as number) -
                ((container.config.margin as { [key: string]: number })
                  .r as number)
              : primaryGroup.config.width;
            const computedGroupHeight = container
              ? (container.config.height as number) -
                ((container.config.margin as { [key: string]: number })
                  .t as number) -
                ((container.config.margin as { [key: string]: number })
                  .b as number) -
                (textHeight ? textHeight : 0)
              : primaryGroup.config.height;

            setComponentFields(primaryGroup.id, {
              width: {
                $set: computedGroupWidth,
              },
              height: {
                $set: computedGroupHeight,
              },
            });
          }
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

    if (component.type === "Container") {
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

  const getXColumnSelectors = (): ColumnSelector[] => {
    return Array.from(
      new Set(
        Object.values(chart.componentsById)
          .flatMap((component) => {
            return component.config.X;
          })
          .filter((x) => x)
      )
    );
  };

  const getYColumnSelectors = (): ColumnSelector[] => {
    return Array.from(
      new Set(
        Object.values(chart.componentsById)
          .flatMap((component) => {
            return component.config.Y;
          })
          .filter((y) => y)
      )
    );
  };

  const getXColumns = () => {
    return Array.from(
      new Set(
        Object.values(chart.componentsById)
          .flatMap((component) => {
            return component.config.X;
          })
          .filter((x) => x)
      )
    );
  };

  const getYColumns = () => {
    return Array.from(
      new Set(
        Object.values(chart.componentsById)
          .flatMap((component) => {
            return component.config.Y;
          })
          .filter((x) => x)
      )
    );
  };

  const getChartDimensions = () => {
    return {
      width,
      height,
    };
  };

  const getContainer = () =>
    Object.values(chart.componentsById).find(
      (component: any) => component.type === "Container"
    );

  const getTextHeight = () => chart.textHeight;

  const setTextHeight = (height: number) =>
    setChart({
      ...chart,
      textHeight: height,
    });

  const getComponents = (ids: string[]) =>
    ids.map((id) => chart.componentsById[id]);

  const context = {
    setChart,
    setTextHeight,
    getTextHeight,
    setComponentFields,
    setInteractions,
    setSelectedComponent,
    getChartTable,
    getXColumns,
    getYColumns,
    getXColumnSelectors,
    getYColumnSelectors,
    getChartDimensions,
    getContainer,
    selectedComponentId,
    getComponents,
    computedChartHeight,
    fetchRemoteTable,
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
