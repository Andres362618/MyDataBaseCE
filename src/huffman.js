// Función para construir la tabla de frecuencias de los caracteres en la contraseña
const buildFrequencyTable = (password) => {
const frequencyTable = {};

for (let i = 0; i < password.length; i++) {
    const char = password[i];
    frequencyTable[char] = frequencyTable[char] ? frequencyTable[char] + 1 : 1;
}

return frequencyTable;
};

// Clase para representar un nodo en el árbol Huffman
class HuffmanNode {
constructor(character, frequency) {
    this.character = character;
    this.frequency = frequency;
    this.left = null;
    this.right = null;
}
}

// Función para construir el árbol Huffman a partir de la tabla de frecuencias
const buildHuffmanTree = (frequencyTable) => {
const nodes = [];

// Crear nodos para cada caracter con su frecuencia
for (const char in frequencyTable) {
    nodes.push(new HuffmanNode(char, frequencyTable[char]));
}

while (nodes.length > 1) {
    // Ordenar los nodos por frecuencia ascendente
    nodes.sort((a, b) => a.frequency - b.frequency);

    // Tomar los dos nodos con menor frecuencia
    const left = nodes.shift();
    const right = nodes.shift();

    // Crear un nuevo nodo padre con la suma de las frecuencias
    const parent = new HuffmanNode(
    left.character + right.character,
    left.frequency + right.frequency
    );
    parent.left = left;
    parent.right = right;

    // Agregar el nodo padre a la lista
    nodes.push(parent);
}

// El último nodo restante es la raíz del árbol Huffman
return nodes[0];
};

// Función para generar el código Huffman para cada caracter
const buildHuffmanCodes = (root) => {
const codes = {};

const buildCode = (node, code) => {
    if (node.left) {
    buildCode(node.left, code + '0');
    }

    if (node.right) {
    buildCode(node.right, code + '1');
    }

    if (!node.left && !node.right) {
    codes[node.character] = code;
    }
};

buildCode(root, '');

return codes;
};

// Función para comprimir una contraseña utilizando el código Huffman
const compressPassword = (password) => {
const frequencyTable = buildFrequencyTable(password);
const huffmanTree = buildHuffmanTree(frequencyTable);
const huffmanCodes = buildHuffmanCodes(huffmanTree);

let compressedPassword = '';
for (let i = 0; i < password.length; i++) {
    const char = password[i];
    compressedPassword += huffmanCodes[char];
}

return compressedPassword;
};

module.exports = {
compressPassword,
};
  