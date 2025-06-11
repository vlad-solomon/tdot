import React from "react";
import { useTdotConfig } from "./provider";
import { twMerge } from "tailwind-merge";

// Allowed typography HTML tags
const TYPOGRAPHY_TAGS = new Set([
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6", // Headings
    "p", // Paragraph
    "span", // Inline text
    "strong",
    "b", // Bold text
    "em",
    "i", // Italic text
    "u", // Underlined text
    "small", // Small text
    "mark", // Highlighted text
    "del",
    "s", // Strikethrough text
    "ins", // Inserted text
    "sub",
    "sup", // Subscript/Superscript
    "code",
    "kbd",
    "samp",
    "var", // Code-related
    "blockquote",
    "cite",
    "q", // Quotations
    "abbr",
    "dfn", // Definitions/Abbreviations
    "time", // Time element
    "address", // Address element
]);

// Cache for resolved component configs to avoid infinite loops
const resolvedConfigCache = new Map();

function resolveComponentConfig(componentName, config, visited = new Set()) {
    // Check cache first
    if (resolvedConfigCache.has(componentName)) {
        return resolvedConfigCache.get(componentName);
    }

    // Prevent infinite loops
    if (visited.has(componentName)) {
        console.warn(
            `[Tdot] Circular dependency detected for "${componentName}"`
        );
        return null;
    }

    const entry = config[componentName];
    if (!entry) {
        return null;
    }

    visited.add(componentName);

    let resolvedEntry = { ...entry };

    // If extends is specified, resolve the parent first
    if (entry.extends) {
        const parentConfig = resolveComponentConfig(
            entry.extends,
            config,
            visited
        );
        if (parentConfig) {
            // Merge parent classes with current classes
            const parentClasses = parentConfig.classes || "";
            const currentClasses = entry.classes || "";

            resolvedEntry = {
                ...parentConfig,
                ...entry,
                classes: twMerge(parentClasses, currentClasses),
            };
        } else {
            console.warn(
                `[Tdot] Cannot extend "${entry.extends}" for "${componentName}": parent not found`
            );
        }
    }

    visited.delete(componentName);

    // Cache the resolved config
    resolvedConfigCache.set(componentName, resolvedEntry);

    return resolvedEntry;
}

export function createTypographyComponent(componentName) {
    return function TypographyComponent({ children, className = "", ...rest }) {
        const config = useTdotConfig();

        // Clear cache when config changes (simple cache invalidation)
        const configKeys = Object.keys(config).join(",");
        if (
            !createTypographyComponent._lastConfigKeys ||
            createTypographyComponent._lastConfigKeys !== configKeys
        ) {
            resolvedConfigCache.clear();
            createTypographyComponent._lastConfigKeys = configKeys;
        }

        const entry = resolveComponentConfig(componentName, config);

        if (!entry || !entry.tag) {
            console.warn(
                `[Tdot] Skipping "${componentName}": missing required "tag" in config.`
            );
            return null;
        }

        const tag = entry.tag.toLowerCase();

        // Validate that the tag is a typography element
        if (!TYPOGRAPHY_TAGS.has(tag)) {
            console.warn(
                `[Tdot] Invalid tag "${
                    entry.tag
                }" for "${componentName}". Only typography elements are allowed: ${Array.from(
                    TYPOGRAPHY_TAGS
                ).join(", ")}`
            );
            return null;
        }

        const Tag = tag;
        const classes = entry.classes || "";

        const mergedClassName = twMerge(classes, className);

        return (
            <Tag className={mergedClassName} {...rest}>
                {children}
            </Tag>
        );
    };
}
