# CS35L-Final-Project

To run the application, first clone the repository using `git clone https://github.com/ajan890/CS35L-Final-Project` Then, follow the steps:  
1. cd into the cloned repository  
2. run `npm install`.  This will install required packages for the program to run.  
3. Open the document in directory `node_modules\webpack\lib\dependencies\HarmonyDetectionParserPlugin.js` and change line 15 to `this.topLevelAwait = true;` and line 14 to `const { topLevelAwait = true } = options || {};`  
4. Return to the top of the cloned repository and run `npm start`  

A tab should open in a browser with the app.  Open in Chrome for best results.
