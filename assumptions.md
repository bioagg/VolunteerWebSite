
# Assumptions for the Project

This document outlines the key assumptions made during the planning and development of the project. These assumptions have guided design decisions and feature implementations.

1. **Administrator Registration**: It is assumed that an administrator cannot register to the system through the regular user registration process. Therefore, an administrator account needs to be created and managed manually, possibly directly in the database or through a separate administrative interface.
2. **Product Description**: It is assumed that the description of each product saved at the table products of the database cannot exceed the 64Kb.
3. **User password's**: All users have password 123123123!Qq.
4. **Base position**: The position of the base is the coordinates of the admin user.
5. **Rescue vehicle**: The rescuer can have exactly one vehicle. If user had more than one car then I had to update the rescuer inventory depending on the vehicle in order to load specific vehicle. 
6. **Autocomplete request user**: It is nosense to add autocomplete mechanism at categories. Autocomplete mechanism is applied only at products table.
7. **Initiate db**: In order to create the db automatically an Initiate db button is located at the register page of the project. Check according files for more details. (Not automatically insert of suitable rows, this mechanism will be applied later)
8. **Announcement offer**: It is assumed that for one announcement you can ask for one specific item only. You cannot ask for multiple products in one announcement. 
9. **Requests quantity**: The request quantity attribute will be always 0 signalizing that it cannot be set.
