# tools

## processors and steps

### naming

- Decisions that make auto-completion easier:
  - Prefix each processor and step with `Processor` and `Step`
  - Separate each word with `_`

## code flow

### StartUp phase

- secure locks for filestats and cache
- scan source folder for files
- call the `onStartUp` method for all steps
  - `startup_steps`
  - `before_steps`
  - `after_steps`
  - `cleanup_steps`
- call the `onRun` method for `startup_steps`
- call the `onStartUp` method for all processors

### Process phase

- call the `onRemove` method for processors of unprocessed removed files
- call the `onAdd` method for processors of unprocessed added files
- write all `iswritable === true` files, regardless of any other condition
- call the `onRun` method for `before_steps`
- call all processor methods for each unprocessed updated file
  - the algorithm here is a bit complex and needs to be written out
- write all `iswritable === true` and `ismodified === true` files
- call the `onRun` method for `after_steps`

### CleanUp phase

- call the `onCleanUp` method for all processors
- call the `onRun` method for all `cleanup_steps`
- call the `onCleanUp` method for all steps

# Finite-state Machine

A **finite-state machine** (**FSM**) or **finite-state automaton** (**FSA**, plural: _automata_), **finite automaton**, or simply a **state machine**, is a mathematical model of computation. It is an abstract machine that can be in exactly one of a finite number of _states_ at any given time. The FSM can change from one state to another in response to some inputs; the change from one state to another is called a _transition_. An FSM is defined by a list of its states, its initial state, and the inputs that trigger each transition. Finite-state machines are of two types—deterministic finite-state machines and non-deterministic finite-state machines. For any non-deterministic finite-state machine, an equivalent deterministic one can be constructed.

## States

- Init
- StartUp
- Process
- CleanUp
- Done
- Exit

## Inputs

- Start
- Restart
- Process
- Quit
- Force Quit
- Exit
