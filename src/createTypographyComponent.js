import React from "react";
import { useTyppoConfig } from "./provider";
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

export function createTypographyComponent(componentName) {
    return function TypographyComponent({ children, className = "", ...rest }) {
        const config = useTyppoConfig();
        const entry = config[componentName];

        if (!entry || !entry.tag) {
            console.warn(
                `[Typpo] Skipping "${componentName}": missing required "tag" in config.`
            );
            return null;
        }

        const tag = entry.tag.toLowerCase();

        // Validate that the tag is a typography element
        if (!TYPOGRAPHY_TAGS.has(tag)) {
            console.warn(
                `[Typpo] Invalid tag "${
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
