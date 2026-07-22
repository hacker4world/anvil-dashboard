### Project description :

This is a stock management dashboard software that manages products (articles), stock, suppliers, factories, depots etc..

### Project techstack :

- Language : Typescript
- Frontend Frameworks : React + Vite + Tailwindcss + Shadcn
- Other Libraries : Zod for form validations, axios for http requests, Lucide react for icons, Zustand for global state management
- Display language : all text that would be shown to the user must be in french, code text like variables, methods etc are in english

### Folder structure :

All the files and directories listed below are under the /src directory :

1. /pages :
   This directory contains all the component pages used in the dashboard
2. /components :
   This directory contains both shadcn components and custom components created for the project with subdirectories :

- modals : contains all modal components
- reusables : contains all the components re-used across the project
- ui : contains shadcn generated components

3. /hooks :
   This directory contains shadcn hooks and custom hooks that take care of the state management, methods etc for each component
4. services :
   contains files with declared functions that sends an http request using axios
5. /store :
   contains zustand store declarations for each entity
6. /models :
   contains typescript interface declarations for request bodies and entities in the project and also Zod schemas for form validations

7. App.tsx :
   Contains router declaration and the main App component
8. main.tsx :
   project entry point

### Pages Architecture :

Each component or page will have its own dedicated custom hook, that hook contains all the logic of the component,
The hook will use functions from the /services directory to execute api requests

Each component that involves api operations handles all errors by using the "StatusBanner" component and must handle loading times by disabling buttons and showing a spinner

Each page has :

- A table used to list entities related to the page with pagination (with the exception of Dépots et Unités page which displays everything in one go)
- Uses a modal with a form to create the entity
- Uses a modal to update/show all details of the entity with a switch on to toggle the possiblity of modifying data on or off
- Uses a modal to filter the entities, the modal contains a form with all possible filtering options, once submitted the modal disappears and filtering occurs (a statusbanner will be showed above the table to indicate that the list is filtered, with a reset button)
- Uses the confirm-delete modal when clicking on the delete action button in the table, once confirmed, the modal disappears and the entity is deleted and cleared from the list
- Has a search bar to search for entities
- Some pages also contain stat cards that shows the number of entities from each category, and some does not

Each page will handle paginated listing as follows :

- Upon page loading, it checks if zustand already has a loaded list of its entities
- If a list is already there, load from zustand
- If the list is empty, load the first page from the api and then populate zustand with that page
- Every entity modification, deletion will also affect zustand to always keep the data fresh in the rendered page
- Each time the user loads another page, it is fetched from the api, appended to zustand and displayed in the table
- Each time the user applies a search or filters, the zustand store will be emptied, page is restored to 1, and fetch filtered results from the api
- When a search/filter is cleared, reset the zustand list and page to 1, and fetch the first page from api without filters applied

- Loading state must be handled by showing a spinner in the page then disappearing when loading is done
- Errors must be handled using the "StatusBanner" component placed on top of the table
- If the error is returned from the api, use the error message inside the "message" field of the api response
- If the error is caused by network (unable to reach the api for some reason), display a helpful generic error telling the user that something went wrong

### Modal architecture :

Here is the architecture that every modal with a form follows :

- Use the component "CustomSelect" for each select type field
- Form field validations will be handled by a zod schema defined inside the folder /models/form-validations and validation errors will also be handled by zod
- Each modal will have its own hook declared in /hooks/{domain}/{hookname}
- The hook will handle all state, methods and business logic and must use service functions, and the zod schema
- Api and network errors will be displayed in the modal using the "StatusBanner" component
- If the error is returned from the api, use the error message inside the "message" field of the api response
- If the error is caused by network (unable to reach the api for some reason), display a helpful generic error telling the user that something went wrong and to refresh the page to try again
- Each modal must handle loading state by displaying a spinner on the submit button and disabling all buttons until the loading is finished (wether on success or error)
- If an operation is successful, the zustand store must be updated accordingly to keep the state and interface fresh, the modal is closed, and a toast is shown to the user with a success message
