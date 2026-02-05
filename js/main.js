"use strict";

export function validateMatrix(m) {
    let depth = -1;
    if (!Array.isArray(m)) {return false;}
    if (m.length == 0) {return false;}
    if (Array.isArray(m[0])) { // condition for 2d array
        depth = 2;
        if (m[0].length == 0) {return false;}
        for (const innerArray of m) {
            if (!Array.isArray(innerArray) || innerArray.length == 0) {return false;}

            if (Array.isArray(innerArray[0]) && innerArray[0].length != 0) { // condition for 3d array
                depth = 3;

                for (const innerElement of innerArray) { // validation of 2d array made of arrays for 3d
                    if (!Array.isArray(innerElement) || innerElement.length == 0) {return false;}

                    for (const inner3DElement of innerElement) {
                        if (!Number.isInteger(inner3DElement)) {return false;}
                    }

                }

            } else {
                
                for (const innerElement of innerArray) { // validation of 2d array
                    if (!Number.isInteger(innerElement)) {return false;}
                }
                
            }
        }
    } else {
        for (const element of m) { // validation of 1d array
            if (!Number.isInteger(element)) {return false;}
        }
        depth = 1;
    }
    return {isValid : true, depth : depth};
}


window.addEventListener('load',() => {
    const textArea = document.querySelector("#input");
    const processButton = document.querySelector("#visualizeButton");


    if (processButton) {
        processButton.addEventListener("click", (e) => {
        
        let str = textArea.value;
        

        //console.log(str);
        str = str.trim();
        if (str != "" & str.startsWith("[") & str.endsWith("]")) {
            try {
                let matrix = JSON.parse(str);
                
                if (validateMatrix(matrix)) {
                    window.localStorage.setItem("matrix", str);
                    window.location.href = "visualizer.html";
                } else {
                    throw new Error("error");
                } 
                
            } catch (error) {
                alert("The format is not valid, please insert a valid JSON.");
            }
            
        } else {
            alert("The format is not valid, please insert a valid JSON.");
        }
        
    });
    }
    
    if (textArea) {
        textArea.addEventListener('keydown', (e) => {
            if (e.key == "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (processButton) {
                    processButton.click();
                }
            }
        });
    }


});



