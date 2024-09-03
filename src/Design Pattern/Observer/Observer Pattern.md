### Definitions

#### Wikipedia

https://en.wikipedia.org/wiki/Observer_pattern

In software design and engineering, the observer pattern is a software design pattern in which an object, named the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes, usually by calling one of their methods.

It is often used for implementing distributed event-handling systems in event-driven software. In such systems, the subject is usually named a "stream of events" or "stream source of events" while the observers are called "sinks of events." The stream nomenclature alludes to a physical setup in which the observers are physically separated and have no control over the emitted events from the subject/stream source. This pattern thus suits any process by which data arrives from some input that is not available to the CPU at startup, but instead arrives seemingly at random (HTTP requests, GPIO data, user input from peripherals and distributed databases, etc.).

#### StackOverflow

https://stackoverflow.com/questions/15594905/difference-between-observer-pub-sub-and-data-binding

---

[**Param**](https://stackoverflow.com/users/728971/param) | answered Mar 24, 2013 at 7:25

> There are two major differences between Observer/Observable and Publisher/Subscriber patterns:
>
> 1. **Observer/Observable** pattern is mostly implemented in a **synchronous** way, i.e. the observable calls the appropriate method of all its observers when some event occurs. The **Publisher/Subscriber** pattern is mostly implemented in an **asynchronous** way (using message queue).
> 2. In the **Observer/Observable** pattern, the **observers are aware of the observable**. Whereas, in **Publisher/Subscriber**, publishers and subscribers **don't need to know each other**. They simply communicate with the help of message queues.
>
> As you mentioned correctly, data binding is a generic term and it can be implemented using either Observer/Observable or Publisher/Subscriber method. Data is the Publisher/Observable.

_EN: Observers observe observables. / Subscribers listen for events; publishers trigger events._

---

[**JerKimball**](https://stackoverflow.com/users/48692/jerkimball) | answered Mar 24, 2013 at 7:42

> Here's my take on the three:
>
> ### Data Binding
>
> Essentially, at the core this just means "the value of property X on object Y is semantically bound to the value of property A on object B. No assumptions are made as to how Y knows or is fed changes on object B.
>
> ### Observer, or Observable/Observer
>
> A design pattern by which an object is imbued with the ability to notify others of specific events - typically done using actual events, which are kind of like slots in the object with the shape of a specific function/method. The observable is the one who provides notifications, and the observer receives those notifications. In .net, the observable can expose an event and the observer subscribes to that event with an "event handler" shaped hook. No assumptions are made about the specific mechanism which notifications occur, nor about the number of observers one observable can notify.
>
> ### Pub/Sub
>
> Another name (perhaps with more "broadcast" semantics) of the Observable/Observer pattern, which usually implies a more "dynamic" flavor - observers can subscribe or unsubscribe to notifications and one observable can "shout out" to multiple observers. In .NET, one can use the standard events for this, since events are a form of MulticastDelegate, and so can support delivery of events to multiple subscribers, and also support unsubscription. Pub/Sub has a slightly different meaning in certain contexts, usually involving more "anonymity" between event and eventer, which can be facilitated by any number of abstractions, usually involving some "middle man" (such as a message queue) who knows all parties, but the individual parties don't know about each other.
>
> ### Data Binding, Redux
>
> In many "MVC-like" patterns, the observable exposes some manner of "property changed notification" that also contains information about the specific property changed. The observer is implicit, usually created by the framework, and subscribes to these notifications via some binding syntax to specifically identify an object and property, and the "event handler" just copies the new value over, potentially triggering any update or refresh logic.
>
> ### Data binding re Redux
>
> An alternative implementation for data binding? Ok, here's a stupid one:
>
> - a background thread is started that constantly checks the bound property on an object.
> - if that thread detects that the value of the property has changed since last check, copy the value over to the bound item.

### Examples

#### Svelte Store

https://svelte.dev/docs/svelte-store

The svelte/store module exports functions for creating readable, writable and derived stores.

Keep in mind that you don't have to use these functions to enjoy the reactive $store syntax in your components. Any object that correctly implements .subscribe, unsubscribe, and (optionally) .set is a valid store, and will work both with the special syntax, and with Svelte's built-in derived stores.

This makes it possible to wrap almost any other reactive state handling library for use in Svelte. Read more about the store contract to see what a correct implementation looks like.
