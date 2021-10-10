import React from "react";
import { useChartOps } from "./ChartOperations";
import { ChartTable, ChartComponent, TableColumn } from "./types";
import { getTableColumn } from "./util";

interface Tag {
  value: string;
}

type TagFunction = (table: ChartTable, arg?: string) => string;

interface TagFunctionMap {
  [key: string]: TagFunction;
}

const nthDatapointFn = (n: number) => {
  return (table: ChartTable, columnName?: string) => {
    const column = getTableColumn(table, columnName || "");
    return "" + column.body[n >= 0 ? n : column.body.length + n];
  };
};

const tagFunctionMap: TagFunctionMap = {
  lastDatapoint: nthDatapointFn(-1),
  secondToLastDatapoint: nthDatapointFn(-2),
};

function parseMixedTags(s: string) {
  const data = [];
  let i = 0;
  const n = s.length;
  while (i < n - 1) {
    if (s[i] === "[" && s[i + 1] === "[") {
      i += 2;
      let objectString = "";
      while (i < n && !(s[i] === "]" && s[i + 1] === "]")) {
        objectString += s[i];
        i++;
      }

      i += 2;
      data.push(JSON.parse(objectString));
    } else {
      let currentString = "";
      while (i < n && !(s[i] === "[" && s[i + 1] === "[")) {
        currentString += s[i];
        i++;
      }

      data.push(currentString);
    }
  }

  return data;
}

function RenderDynamicText(props: any) {
  const { id, config, children } = props;
  const { font, display, margin, color, innerText } = config;
  const { getChartTable, getComponents } = useChartOps();

  const chartTable = getChartTable();
  const childComponents = getComponents(children);
  const mixedTags = parseMixedTags(innerText.trim());

  const evalTag = (tag: Tag) => {
    const funcallMatch = tag.value.match(/^(\w+)\(([\w\s]+)\)$/);
    if (funcallMatch) {
      const fn = tagFunctionMap[funcallMatch[1]];
      const arg = funcallMatch[2];

      return fn && fn(chartTable, arg);
    }

    const fn = tagFunctionMap[tag.value];
    return fn && fn(chartTable);
  };

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
        : mixedTags.map((tagComponent: string | Tag) =>
            typeof tagComponent === "string"
              ? tagComponent
              : evalTag(tagComponent)
          )}
    </div>
  );
}

export default RenderDynamicText;
