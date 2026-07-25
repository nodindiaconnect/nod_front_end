import React, { useState } from "react";

const WORD_LIMIT = 25;

export function ExpandableCell({
    text,
    maxLines = 2,
    wordLimit = WORD_LIMIT,
}) {
    const [expanded, setExpanded] = useState(false);

    if (text == null || text === "") {
        return <span className="text-muted">—</span>;
    }

    const words = String(text).trim().split(/\s+/);
    const isLong = words.length > wordLimit;

    return (
        <div>
            <p
                className={expanded ? "" : "overflow-hidden"}
                style={
                    expanded
                        ? undefined
                        : {
                              display: "-webkit-box",
                              WebkitLineClamp: maxLines,
                              WebkitBoxOrient: "vertical",
                          }
                }
            >
                {text}
            </p>

            {isLong && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded((v) => !v);
                    }}
                    className="text-xs font-medium mt-1 hover:underline"
                    style={{ color: "var(--primary, #3a2418)" }}
                >
                    {expanded ? "Show less" : "Read more"}
                </button>
            )}
        </div>
    );
}

export default function Table({
    columns,
    data,
    rowKey = "id",
    emptyMessage = "No data available.",
    onRowClick,
    minWidth = "720px",
}) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 text-muted text-sm border border-border rounded-sm">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto w-full border border-border rounded-sm">
            <table
                className="w-full table-fixed text-sm border-collapse"
                style={{ minWidth }}
            >
                <colgroup>
                    {columns.map((col) => (
                        <col
                            key={col.key}
                            style={{ width: col.width || "auto" }}
                        />
                    ))}
                </colgroup>

                <thead>
                    <tr className="bg-background border-b border-border">
                        {columns.map((col) => {
                            const Icon = col.icon;

                            return (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-left font-semibold text-heading border-r border-border last:border-r-0 ${col.className || ""}`}
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        {Icon && (
                                            <Icon
                                                size={16}
                                                className="text-primary"
                                            />
                                        )}
                                        <span>{col.label}</span>
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, i) => (
                        <tr
                            key={row[rowKey] ?? i}
                            onClick={() => onRowClick?.(row)}
                            className={`border-b border-border last:border-b-0 transition-colors ${
                                onRowClick
                                    ? "cursor-pointer hover:bg-background"
                                    : ""
                            }`}
                        >
                            {columns.map((col) => {
                                const value = col.render
                                    ? col.render(row)
                                    : row[col.key];

                                const isPlainText =
                                    typeof value === "string" ||
                                    typeof value === "number";

                                return (
                                    <td
                                        key={col.key}
                                        className={`px-4 py-3 align-top text-text break-words border-r border-border last:border-r-0 ${col.className || ""}`}
                                        style={{
                                            fontFamily:
                                                "var(--font-body)",
                                        }}
                                    >
                                        {col.truncate &&
                                        isPlainText ? (
                                            <ExpandableCell
                                                text={value}
                                                maxLines={
                                                    col.maxLines || 2
                                                }
                                            />
                                        ) : (
                                            value
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}