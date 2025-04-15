# Events

see also [Events System @ figma](https://www.figma.com/file/LAT64wsmWZNrP7CfS0GGdC/Events-System?type=whiteboard&node-id=0-1&t=LE0FuAL684KDabxT-0)

## In xml aka "config"

```xml
    <Trigger
        onEvent="WHEN event_module IS messages"
        matches="WHEN event_threadId IS global_currentThread.id"
    />

    <!-- alternative -->

    <Trigger
        event:module="messages"
        event:data.thread="global_currentThread.id"
    />

```
