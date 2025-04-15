# How does the Anthroware's framework works

-   [Components](components.md)
-   [Screens](screens.md)
-   [Layouts](layouts.md)
-   [Composers](composers.md)
-   [Context Parser](context-parser.md)
-   [Selector](selector.md)
-   [Screen Selector](screen-selector.md)

## Overview

```mermaid
flowchart LR
    Model["Data Model"] <--> UI["User Interface"]
```

## Data Model

```mermaid
erDiagram
    DBModel ||--|| ClientModel: ""
    ClientConfig ||--|| ClientModel: ""
```

## User Interface

```mermaid
erDiagram
    Widget {
        String type "PK"
        String color
        String position
        String textVariant
    }
    Row {
        WidgetList children
        String layout
    }
    Button {
        String text
        String variant
        String effect
        String target
    }
    Header {
        String text
        String size
    }
    Input {
        String label
        String placeholder
        String type
    }
    Selector {
        Item items "list"
        Item selected
    }
    Container  }|--o{ Widget: ""
    Row  ||--|{ Widget: "children"
    Widget ||--|| Row : ""
    Widget ||--|| Header : ""
    Widget ||--|| Button: ""
    Widget ||--|| Input: ""
    Widget ||--|| Selector: ""

    ClientModel ||--|| Container: ""

```
