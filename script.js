const MAP_WIDTH = 1250;
const MAP_HEIGHT = 750;
const VIEWPORT_WIDTH = 100;
const VIEWPORT_HEIGHT = 50;
let hideBottom = false;

const FEATURES = [
    '  ', '^^', '~~', 'TT',
    '^^', '^^', '~~', '~~', 'TT', 'TT'
];

const DETAILED_FEATURES = {
    'mountain': [
        '  /\\  ',
        ' /  \\ ',
        '/    \\'
    ],
    'forest': [
        '  TT  ',
        ' TTTT ',
        '  TT  '
    ],
    'stream': [
        '  ~~  ',
        ' ~~~~ ',
        '  ~~  '
    ],
    'plain': [
        '      ',
        '      ',
        '      '
    ]
};

function generateMap(width, height) {
    const map = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const feature = FEATURES[Math.floor(Math.random() * FEATURES.length)];
            row.push(feature);
        }
        map.push(row);
    }
    return map;
}
function displayMap(map, topLeft) {
    const mapElement = document.getElementById('map');
    let mapString = '';
    const centerX = Math.floor(VIEWPORT_WIDTH / 2);
    const centerY = Math.floor(VIEWPORT_HEIGHT / 2);
    const textHeight = 3;

    for (let y = 0; y < VIEWPORT_HEIGHT; y++) {
        for (let x = 0; x < VIEWPORT_WIDTH; x++) {
            const mapX = topLeft[0] + x;
            const mapY = topLeft[1] + y;
            if (mapX >= 0 && mapX < MAP_WIDTH && mapY >= 0 && mapY < MAP_HEIGHT) {
                const feature = map[mapY][mapX];
                if (feature === '^^') {
                    mapString += DETAILED_FEATURES['mountain'][y % 3];
                } else if (feature === 'TT') {
                    mapString += DETAILED_FEATURES['forest'][y % 3];
                } else if (feature === '~~') {
                    mapString += DETAILED_FEATURES['stream'][y % 3];
                } else {
                    mapString += DETAILED_FEATURES['plain'][y % 3];
                }
            }
        }
        mapString += '\n';
    }
    mapElement.textContent = mapString;
}

function moveViewport(topLeft, currentDirection) {
    const directions = ['w', 'a', 's', 'd'];
    let direction = currentDirection;
    if (Math.random() >= 0.7) {
        direction = directions[Math.floor(Math.random() * directions.length)];
    }

    if (direction === 'w' && topLeft[1] > 0) {
        topLeft[1] -= 1;
    } else if (direction === 's' && topLeft[1] < MAP_HEIGHT - VIEWPORT_HEIGHT) {
        topLeft[1] += 1;
    } else if (direction === 'a' && topLeft[0] > 0) {
        topLeft[0] -= 1;
    } else if (direction === 'd' && topLeft[0] < MAP_WIDTH - VIEWPORT_WIDTH) {
        topLeft[0] += 1;
    }
    return [topLeft, direction];
}

function updateMap(map, topLeft, currentDirection) {
    [topLeft, currentDirection] = moveViewport(topLeft, currentDirection);
    displayMap(map, topLeft);
    setTimeout(() => updateMap(map, topLeft, currentDirection), 100);
}

document.addEventListener('DOMContentLoaded', () => {
    const map = generateMap(MAP_WIDTH, MAP_HEIGHT);
    let topLeft = [0, 0];
    let currentDirection = 's';
    
    const textElement = document.getElementById('text');
    const infoElement = document.getElementById('info');
    const privacyPolicyElement = document.getElementById('privacy-policy');
    const privacyInfoElement = document.getElementById('privacy-info');
    
    textElement.addEventListener('click', () => {
        hideBottom = !hideBottom;
        infoElement.style.display = hideBottom ? 'block' : 'none';
        privacyInfoElement.style.display = 'none';
    });

    privacyPolicyElement.addEventListener('click', (event) => {
        event.preventDefault();
        privacyInfoElement.style.display = 'block';
        privacyPolicyElement.scrollIntoView({ behavior: 'smooth' });
    });
    
    updateMap(map, topLeft, currentDirection);
});