import { intToHex, rgbToInt, getCursorPosition, getIntSuffix, sortNumber } from '/utils'

const addNodeButton = document.getElementById("addNodeButton")
const nodeWrapper = document.getElementById("nodeWrapper")
const canvas = document.getElementById("mainCanvas");
const hitCanvas = document.getElementById("hitCanvas");
const saveButton = document.getElementById("SaveBtn")
const loadButton = document.getElementById("LoadBtn")
const fileInput = document.getElementById("fileInput")

const ctx = canvas.getContext("2d");
const hitCtx = hitCanvas.getContext("2d");

let boldFont = new FontFace('JetBrainsMonoBold', 'url(./JetBrainsMono-ExtraBold.ttf)')
let font = new FontFace('JetBrainsMono', 'url(./JetBrainsMono-Bold.ttf)')

let selectedNodeIndex = -1
let isMouseDown = false
let isCreatingConnection = false
let isShowingConnection = false
let connectionEditorSelected = 0
let connectionEditorIndicies = [0, 0]

boldFont.load().then(function (font) {
  document.fonts.add(font);
  console.log('Font loaded');
});
font.load().then(function (font) {
  document.fonts.add(font);
  console.log('Font loaded');
});

let origin = { x: -140, y: 0 }
let semesterCredits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let nodes = [/*
  {
    name: 'CSC110',
    credits: 3,
    color: '#3dff57',
    isSettled: false,
    selected: false,
    semesterIndex: 0,
    x: 50,
    y: 175
  },
  {
    name: 'CSC110',
    credits: 3,
    color: '#3dff57',
    isSettled: false,
    selected: false,
    semesterIndex: 0,
    x: 400,
    y: 100
  }*/
]

//connections are the index the first is the right connection the third is from the left
let connections = []

function draw() {
  drawBackground()
  drawGraph()

  drawConnections(connections)
  createConnectionGui()

  correctNodes(nodes)
  handleNodes(nodes)

  window.requestAnimationFrame(draw)
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hitCtx.clearRect(0, 0, hitCanvas.width, hitCanvas.height);
  ctx.fillStyle = "#2c2d30";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGraph() {
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = "#616161";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#616161"
    ctx.textAlign = "center";
    ctx.font = "18px JetBrainsMono";

    if (i != 0) {
      ctx.beginPath();
      ctx.roundRect(i * 325 + 25 + origin.x, 45 + origin.y, 100, 30, [5]);
      ctx.stroke();

      ctx.fillText(`${getIntSuffix(i * 2 - 1)}: ${semesterCredits[i * 2 - 1]}`, i * 325 + 75 + origin.x, 65 + origin.y);

      ctx.beginPath();
      //index * spacing + left offset
      ctx.moveTo(i * 325 + 75 + origin.x, 75 + origin.y);
      ctx.lineTo(i * 325 + 75 + origin.x, 450 + origin.y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.roundRect(i * 325 + 175 + origin.x, 45 + origin.y, 100, 30, [5]);
    ctx.stroke();

    ctx.fillText(`${getIntSuffix(i * 2)}: ${semesterCredits[i * 2]}`, i * 325 + 225 + origin.x, 65 + origin.y);

    ctx.beginPath();
    ctx.moveTo(i * 325 + 225 + origin.x, 75 + origin.y);
    ctx.lineTo(i * 325 + 225 + origin.x, 450 + origin.y);
    ctx.stroke();
  }
}

//corrects nodes to the closest semester line
function correctNodes(nodes) {
  if (isMouseDown) {
    return
  }
  nodes.forEach((element, index) => {
    let closestDistance = 99999
    let correctionDirectionX = 0
    let semesterIndex = 0

    //correct X to closest semester line
    for (let i = 0; i < 5; i++) {
      //linepos - element.x - element width
      let distanceToLine = 99999
      if (i != 0) {
        let distanceToLine = i * 325 + 75 - element.x - 50
        if (Math.abs(distanceToLine) < closestDistance) {
          closestDistance = Math.abs(distanceToLine)
          correctionDirectionX = Math.sign(distanceToLine)
          semesterIndex = i * 2 - 1
        }
        //console.log("distance: " + distanceToLine)
      }

      distanceToLine = i * 325 + 225 - element.x - 50
      if (Math.abs(distanceToLine) < closestDistance) {
        closestDistance = Math.abs(distanceToLine)
        correctionDirectionX = Math.sign(distanceToLine)
        semesterIndex = i * 2
      }

      //console.log("distance: " + distanceToLine)
      //console.log("closest distance: " + closestDistance)
    }

    //correct Y to bounds
    if (element.y < 80) {
      nodes[index].y += 1
    }
    if (element.y > 400) {
      nodes[index].y += -1
    }

    if (closestDistance != 0) {
      nodes[index].x += correctionDirectionX
    }
    if (closestDistance == 0 && element.isSettled == false) {
      semesterCredits[semesterIndex] += element.credits
      nodes[index].isSettled = true
      nodes[index].semesterIndex = semesterIndex
    }
  });
}

function handleNodes(nodes) {
  nodes.forEach((element, index) => {
    if (!isCreatingConnection) { nodes[index].selected = false }
    drawNode(element.name, element.credits, element.color, element.selected, element.x, element.y, index)
  });
}

function drawNode(name, credits, color, isSelected, positionX, positionY, index) {
  let width = 100
  let height = 50

  if (isSelected) {
    ctx.fillStyle = '#616161';
    ctx.beginPath();
    ctx.roundRect(positionX + origin.x - 5, positionY + origin.y - 5, width + 10, height + 10, [5]);
    ctx.fill();
  }

  //nodeBG
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(positionX + origin.x, positionY + origin.y, width, height, [5]);
  ctx.fill();

  //title
  ctx.fillStyle = "#000000"
  ctx.font = "16px JetBrainsMono";
  ctx.textAlign = "center";
  ctx.fillText(name, positionX + width / 2 + origin.x, positionY + 20 + origin.y);

  //credits
  ctx.font = "14px JetBrainsMono";
  ctx.textAlign = "center";
  ctx.fillText(`credits: ${credits}`, positionX + width / 2 + origin.x, positionY + 40 + origin.y);

  //hitbox
  hitCtx.fillStyle = intToHex(index + 1);
  hitCtx.fillRect(positionX + origin.x, positionY + origin.y, width, height);
}

function drawConnections(connections) {
  connections.forEach((connection, index) => {
    let startPos = { x: nodes[connection[0]].x + 100 + origin.x, y: nodes[connection[0]].y + 25 + origin.y }
    let endPos = { x: nodes[connection[1]].x + origin.x, y: nodes[connection[1]].y + 25 + origin.y }

    ctx.lineWidth = 5;

    const gradient = ctx.createLinearGradient(nodes[connection[0]].x, nodes[connection[0]].y, nodes[connection[1]].x, nodes[connection[1]].y);
    gradient.addColorStop(.2, nodes[connection[0]].color);
    gradient.addColorStop(.5, nodes[connection[1]].color);

    ctx.strokeStyle = gradient

    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
    ctx.bezierCurveTo(startPos.x + 25, startPos.y, endPos.x - 25, endPos.y, endPos.x, endPos.y);
    ctx.stroke();
  })
}

function createConnectionGui() {
  ctx.fillStyle = "#ffffff"
  ctx.font = "20px JetBrainsMono";
  ctx.textAlign = "center";
  if (isCreatingConnection && !isShowingConnection) {
    ctx.fillText(`connection editor enabled - hold [N] to show connection`, 475, 485);
  } else if(!isCreatingConnection && !isShowingConnection)  {
    ctx.fillText(`hold [space] to add connections - hold [N] to show connection`, 475, 485);
  } else if(!isCreatingConnection && isShowingConnection)  {
    ctx.fillText(`hold [space] to add connections - showing connections`, 475, 485);
  } else if(isCreatingConnection && isShowingConnection)  {
    ctx.fillText(`connection editor enabled - showing connections`, 475, 485);
  }
}


canvas.addEventListener('mousedown', function (e) {
  let coordinates = getCursorPosition(canvas, e)
  let hitData = hitCtx.getImageData(coordinates[0], coordinates[1], 1, 1).data
  let index = rgbToInt(hitData[0], hitData[1], hitData[2])

  //subtract 1 because 1 is added in drawNode
  selectedNodeIndex = index - 1

  if (selectedNodeIndex != -1) {

    if (isCreatingConnection == false) {

      semesterCredits[nodes[selectedNodeIndex].semesterIndex] -= nodes[selectedNodeIndex].credits
      nodes[selectedNodeIndex].isSettled = false
    }
    else if (isCreatingConnection == true) {

      nodes[selectedNodeIndex].selected = true
      connectionEditorSelected += 1

      if (connectionEditorSelected != 2) {
        connectionEditorIndicies[0] = selectedNodeIndex
      }
      else if (connectionEditorSelected === 2) {
        connectionEditorIndicies[1] = selectedNodeIndex

        //not sure why connection editor is being sorted but here is a quick fix
        let savedNodeIndex = connectionEditorIndicies

        let shouldAdd = true
        connections.forEach((connection, index) => {
          let sortedConnection = sortNumber(connection)
          let sortedEditorConnection = sortNumber(connectionEditorIndicies)
          if (JSON.stringify(sortedConnection) == JSON.stringify(sortedEditorConnection)) {
            connections.splice(index, 1)
            shouldAdd = false
          }

        });

        if (shouldAdd) {
          connections.push(savedNodeIndex)
        }
      }
    }
  }
  isMouseDown = true
})

canvas.addEventListener('mousemove', function (e) {
  if (selectedNodeIndex != -1) {
    nodes[selectedNodeIndex].x += e.movementX
    nodes[selectedNodeIndex].y += e.movementY
  } else if (selectedNodeIndex === -1 && isMouseDown) {
    origin.x += e.movementX
    if (origin.x < -700) {
      origin.x = -700
    } else if (origin.x > -140) {
      origin.x = -140
    }
    //origin.y += e.movementY
  }
})

canvas.addEventListener('mouseup', function (e) {
  selectedNodeIndex = -1
  isMouseDown = false
})

document.addEventListener('keydown', (e) => {
  console.log(e.code)
  if (e.code === 'Space') {
    isCreatingConnection = true
  }
  if (e.code === 'KeyN') {
    isShowingConnection = true
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    connectionEditorSelected = 0
    connectionEditorIndicies = [0, 0]
    isCreatingConnection = false
  }
  if (e.code === 'KeyN') {
    isShowingConnection = false
  }
});

function createNodeGui(id, name = 'CSC110', credits = 3, color="#3dff57") {
  let elem = document.createElement('div')
  elem.classList.add('node')
  elem.id = `node-${id}`
  elem.innerHTML = `
  <span class="nodeText"> name: <input id="nodeName-${id}" class="nodeInput nodeName" type="text" placeholder="CSC110" value="${name}"> </input></span>
  <span class="nodeText"> credits: <input id="nodeCredits-${id}" class="nodeInput nodeCredits" type="number" min="1" value="${credits}"> </input></span>
  <span class="nodeText"> color: <input id="nodeColor-${id}" class="nodeInput nodeColor" type="color" value="${color}" > </input></span>
  <button class="nodeClose" id="nodeClose-${id}" ></button>
  `

  return elem
}

addNodeButton.onclick = (e) => {
  let elem = createNodeGui(nodes.length);
  let defaultNode = {
    name: 'CSC110',
    credits: 3,
    color: '#3dff57',
    isSettled: false,
    selected: false,
    semesterIndex: 0,
    x: 50 - origin.x,
    y: 100
  }

  nodes.push(defaultNode)
  nodeWrapper.appendChild(elem)
  let closeBtn  = document.getElementById(`nodeClose-${nodes.length - 1}`)

  closeBtn.addEventListener('click', () => {
    deleteNode(nodes.length - 1)
  })
}

nodeWrapper.addEventListener('input', (e) => {
  let children = nodeWrapper.children;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    let index = child.id.split('-')[1]

    //update semester credits
    let newCredits = parseInt(document.getElementById(`nodeCredits-${index}`).value)
    semesterCredits[nodes[index].semesterIndex] -= nodes[index].credits
    semesterCredits[nodes[index].semesterIndex] += newCredits

    nodes[index].name = document.getElementById(`nodeName-${index}`).value
    nodes[index].credits = newCredits
    nodes[index].color = document.getElementById(`nodeColor-${index}`).value
  }
})

function download(object) {
  var element = document.createElement('a');
  element.style.display = 'none';

  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(object)))

  element.setAttribute('download', 'CollegePlan.json')

  document.body.appendChild(element)

  element.click();

  document.body.removeChild(element)
}

function deleteNode(id) {
  let element = document.getElementById(`node-${id}`)
  element.remove()
  nodes.splice(id, 1)
  connections.forEach((connection, index) => {
    if (connection[0] == id || connection[1] == id) {
      connections.splice(index, 1)
    }
  })
}

saveButton.addEventListener('click', () => {

  let data = { nodes: nodes, connections: connections }
  download(data)
})

loadButton.addEventListener('click', () => {
  fileInput.style.display = 'inline'
  if (fileInput.value != '') {
    let selectedFile = fileInput.files[0];

    let reader = new FileReader();
    
    reader.onload = function (event) {
      let contents = event.target.result;
      let data = JSON.parse(contents)
      nodes = data.nodes
      connections = data.connections
      semesterCredits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

      nodes.forEach((element, index) => {
        let elem = createNodeGui(index, element.name, element.credits, element.color)
        semesterCredits[element.semesterIndex] += element.credits
        nodeWrapper.appendChild(elem)
      })
    };
    reader.readAsText(selectedFile);
  }
})

fileInput.addEventListener('input', (e) => {
  document.getElementById('fileDirectionText').style.display = 'inline'
})

window.requestAnimationFrame(draw)