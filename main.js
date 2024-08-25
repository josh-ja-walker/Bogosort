var lineLengths = [], vLines = [], sorting = false, interval, endTimeout;
var numLines = 25, min = 1;

const defaultSleepMult = 0.6, minSleep = 1, maxSleep = 1000;
var sleepMult = defaultSleepMult; 
var sleepTime = CalcSleep();

const sizeInp = document.getElementById("length");

const faster = document.getElementById("faster");
const slower = document.getElementById("slower");

const iterationsText = document.getElementById("iterations");
iterations = 1;

var playing = true;
var needClear = false;

var sortNum = 0;
var sortColors = ["orangered", "#06c"]

var bubbleSortIndex = 0;
var bubbleSwapped = false;


function PressPlayPause()
{
    if (sorting)
    {
        playing ? Pause(): Play();
    }
    else if (!needClear)
    {
        SetUp();
    }
}

function Stop()
{
    Pause();
    clearTimeout(endTimeout);

    for (const element of vLines) {
        element.remove();
    }

    lineLengths = [];
    vLines = [];
    
    bubbleSortIndex = 0;
    bubbleSwapped = false;

    iterations = 1;
    iterationsText.innerHTML = "Iterations: 0"; 
    
    sorting = false;
    needClear = false;

    sleepMult = defaultSleepMult;

    document.getElementById("settings").reset();
    setTimeout(SetLengthLabel, 1);

    sizeInp.disabled = false;

    console.clear();
}

function SetTime(isFaster)
{
    const sleepIncrements = 0.2;

    sleepMult += (isFaster ? -1 : 1) * sleepIncrements;
    
    if (sleepMult < 0)
    {
        sleepMult = 0;
        return;
    }
    else if (sleepMult > 1)
    {
        sleepMult = 1;
        return;
    }

    sleepMult = Math.round(sleepMult * 100) / 100;

    sleepTime = CalcSleep();
    
    console.log(sleepTime);
    
    if (sorting && playing)
    {
        Pause();
        Play();
    }
}

function CalcSleep()
{
    return Math.round(Math.pow(Math.E, Math.log(maxSleep - minSleep + 1) * sleepMult) + minSleep - 1);
}

function Pause()
{
    clearInterval(interval);
    playing = false;
    document.getElementById("play-pause").innerHTML = "&#x23F5;";
}

function Play()
{   
    interval = setInterval(Sort, sleepTime)
    
    playing = true;
    document.getElementById("play-pause").innerHTML = "&#x23F8;";
}

function SetLengthLabel() 
{
    document.getElementById("size-label").innerHTML = "Array size: " + String(sizeInp.value).padStart(2, '0');
}

function SetUp()
{
    sizeInp.disabled = true;
    numLines = sizeInp.value;

    lineLengths = GenerateArray(numLines);
    
    vLines = Array(lineLengths.length);
    for (let index = 0; index < lineLengths.length; index++) 
    {
        vLines[index] = CreateLine(lineLengths[index]);
    }

    sorting = true;
    iterationsText.innerHTML = "Iterations: 1";
    Play();
}

function GenerateArray(n)
{
    arr = [];
    for (let i = 1; i <= n; i++) {
        arr.push(i);
    }

    Shuffle(arr);
    return arr;
}

function CreateLine(value)
{
    var element = document.createElement("div");

    element.classList.add("vLine");

    SetLine(element, value);
    document.getElementById("box").append(element);

    return element;
}

function SetLine(element, value)
{
    element.style.height = ((value / numLines) * 95) + "%";
    // element.style.bottom = (((value / max) * 95) - 94) + "%";
}

function Sort() 
{
    iterations += 1;
    iterationsText.innerHTML = "Iterations: " + iterations;

    done = ChooseSort();

    ChangeLines();

    if (done) 
    {
        Pause();
        sorting = false;
        needClear = true;

        endTimeout = setTimeout(End, 1050);
    }
}

function SetSort(i) {
    if (!sorting) {
        sortNum = i;
        document.body.style.setProperty('--main-color', sortColors[sortNum])
    }
}

function ChooseSort()
{
    switch (sortNum) {
        case 0:
            return Bogosort();
        
        case 1:
            return BubbleSort(true);

        default:
            break;
    }
}

function End()
{
    alert("Sorted!");
}

function ChangeLines()
{
    for (let index = 0; index < lineLengths.length; index++) 
    {
        SetLine(vLines[index], lineLengths[index]);
    }
}

function Rand(_min, _max)
{
    return Math.floor(Math.random() * (_max - _min) + _min);
}

function Shuffle(array)
{
    let currentIndex = array.length,  randomIndex;
    
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        SwapArr(currentIndex, randomIndex, array);
    }
}

function Bogosort()
{
    Shuffle(lineLengths);
    return CheckArray(true);
}

function BubbleSort(isAsc)
{
    if ((lineLengths[bubbleSortIndex - 1] > lineLengths[bubbleSortIndex] && isAsc) ) 
    {
        Swap(bubbleSortIndex - 1, bubbleSortIndex);
        bubbleSwapped = true;
    }
    
    if (bubbleSortIndex >= lineLengths.length - 1)
    {
        bubbleSortIndex = 0;

        if (bubbleSwapped)
        {
            bubbleSwapped = false;
            return false;
        }
        else 
        {
            return true;
        }
    }
    else
    {
        bubbleSortIndex++;
        return false;
    }

}

function Swap(firstIndex, secondIndex) 
{
    SwapArr(firstIndex, secondIndex, lineLengths);
}

function SwapArr(i, j, arr) 
{
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function CheckArray(isAsc) 
{
    for (let index = 1; index < lineLengths.length; index++) 
    {
        if ((lineLengths[index - 1] > lineLengths[index] && isAsc) 
        || (lineLengths[index - 1] < lineLengths[index] && !isAsc)) 
        {
            return false;
        }
    }

    return true;
}