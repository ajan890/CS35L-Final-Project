# CS35L-Final-Project

Usage Instructions:
    - To run the application, first clone the repository using `git clone https://github.com/ajan890/CS35L-Final-Project` Then, follow these steps:  

    1. cd into the cloned repository  
    2. run `npm install`.  This will install required packages for the program to run.  
    3. Return to the top of the cloned repository and run `npm start`  

A tab should open in a browser with the app.  Open in Chrome for best results.

**NOTICE:** There are API keys present in the code, which were used during development and the demo.  However, the Firebase database has been reset, and thus **the API keys no longer work.**  To use this app, you will have to replace the API keys with your own.

Project Description:
    This project is a community-oriented market-style request making and fulfillment platform.
    Users will be able to create requests about items they want and specify details such as 
    the amount, where to get them, and where to deliver them. Users will also be able to
    browse requests made by other users and choose to accept and fulfill them. There is also
    an automatic bounty system in place which rewards consistent fulfillers in order to help
    motivate users and help keep the project going.

User Info:
    When the project is first opened, users will land on the home page. Visitors can sign up 
    or login using either the button on the right of the navigation bar or the login button
    in the middle of the home page. After signing up/logging in, users are redirected to the
    dashboard, where most of the action takes place. The logo on the left side of the navigation
    bar becomes a link to the dashboard once the user has logged in.

    In the dashboard, personal requests made are listed on the top row, and requests from others
    taken to fulfill will be listed on the bottom row. On the right side there are two buttons,
    one to submit your own request and one to browse public requests made by others available
    for taking to fulfill. 

    To create a request, simply click on the "Submit Request" button and fill out all of the 
    necessary information before clicking submit. Each request has a completion bounty/reward 
    associated with it, meaning that you must have money in your account before your are able to
    submit a request. You can charge your balance through the "Add Balance" button on dashboard.
    After submitting the request successfully, you can click on the X on the top right of the 
    submission form to return to dashboard. The request submitted will now show up in your own
    dashboard on the top row.

    To accept a request, click on the "Go to Requests" button and browse all publically
    available requests not yet taken. You can search for specific requests by their tags 
    using the search bar at the very top. To take a request, simply click on the "Take Request"
    button at the bottom of the request entry. This request will now show up in your own
    dashboard on the bottom row as a request to be fulfilled.

    Each request has a 4 digit pin associated with it initially known only to the requester.
    In order to complete a request, the requester will need to provide this PIN to the
    fulfiller who then inputs the PIN into the input box for the particular request on their
    end, signifying both sides' agreement that the request has been completed.

    To Sign out of the application, simply click on the navbar icon on the top right of the
    page and then click "Sign Out".
