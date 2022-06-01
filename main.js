var lineLengths = [], vLines = [], sorting = false, interval, max = 25, min = 1;
var sleepTime = 0;

const sizeInp = document.getElementById("length");

const sortButton = document.getElementById("sort-button");
const clearButton = document.getElementById("clear-button");
clearButton.disabled = true;

const graph = document.getElementById("graph");
graph.style.width = "100%";

const iterationsText = document.getElementById("iterations");
iterations = 1;

function GetTime()
{
    sleepTime = document.getElementById("sleep-time").value * 1000;

    if (sorting) 
    {
        clearInterval(interval);
        interval = setInterval(Sort, sleepTime);
    }
}

function SetUp()
{
    sortButton.disabled = true;
    sizeInp.disabled = true;
    graph.style.width = "fit-content";

    max = maxInp.value;
    GetTime();

    lineLengths = GenerateArray(sizeInp.value);
    
    console.log(lineLengths);

    vLines = Array(lineLengths.length);
    for (let index = 0; index < lineLengths.length; index++) 
    {
        vLines[index] = CreateLine(lineLengths[index], maxInp.value);
    }

    clearButton.disabled = false;
    
    sorting = true;
    interval = setInterval(Sort, sleepTime);
}

function GenerateArray(_arrLength)
{
    arr = Array(_arrLength);

    for (let index = 0; index < _arrLength; index++)
    {
        arr[index] = Rand(min, max);
    }

    return arr;
}

function CreateLine(value)
{
    var element = document.createElement("div");

    element.classList.add("vLine");

    // element.style.borderLeftWidth = (graph.clientWidth / length)  + "px";
    SetLine(element, value);
    graph.append(element);

    return element;
}

function SetLine(element, value)
{
    element.style.height = ((value / max) * 100) + "%";
    element.style.bottom = (((value / max) * 100) - 96) + "%";
}

function Sort() 
{
    iterations += 1;
    iterationsText.innerHTML = "Iterations: " + iterations;
    
    ChangeLines();

    if (CheckArray(lineLengths, true)) 
    {
        console.log("done in " + iterations);
        clearInterval(interval);
    }
}

function ChangeLines()
{
    ShuffleArray(lineLengths);
    
    console.log(lineLengths);

    for (let index = 0; index < lineLengths.length; index++) 
    {
        SetLine(vLines[index], lineLengths[index]);
    }
}

function Rand(_min, _max)
{
    return Math.floor(Math.random() * (_max - _min) + _min);
}

function ShuffleArray(array)
{
    let currentIndex = array.length,  randomIndex;
    
    while (currentIndex != 0) {
    
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        Swap(array, currentIndex, randomIndex);
    }

    return array;
}

function Swap(array, firstIndex, secondIndex) 
{
    var temp = array[firstIndex];
    array[firstIndex] = array[secondIndex];
    array[secondIndex] = temp;
}

function CheckArray(array, isAsc) 
{
    for (let index = 1; index < array.length; index++) 
    {
        if ((array[index - 1] > array[index] && isAsc) || (array[index - 1] < array[index] && !isAsc)) 
        {
            return false;
        }
    }

    return true;
}

function Clear()
{
    clearInterval(interval);

    for (const element of vLines) {
        element.remove();
    }

    lineLengths = [];
    vLines = [];
    iterations = 0;
    sorting = false;

    sortButton.disabled = false;
    sizeInp.disabled = false;
    clearButton.disabled = true;

    graph.style.width = "100%";

    console.clear();
}