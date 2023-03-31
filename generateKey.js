const chave = () => {
    function generateRandomHex() {
        const randomHex = Math.floor(Math.random() * 16).toString(16);
        return randomHex;
    }

    function generateBlock() {
        let block = '';
        for (let i = 0; i < 8; i++) {
            block += generateRandomHex();
        }
        return block;
    }

    function generateUUID() {
        const block1 = generateBlock();
        const block2 = generateBlock();
        const block3 = generateBlock();
        const block4 = generateBlock();
        const block5 = generateBlock() + generateBlock();
        return `${block1}-${block2}-${block3}-${block4}-${block5}`;
    }

    const chave = generateUUID();

    return chave;
}

module.exports = {
    chave,
}