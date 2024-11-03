const words = ["Yellow", "Red", "Green", "Purple", "Orange", "White",'Black','Brown'];
const gridSize = 10;
        let grid;
        
        function initializeGrid() {
            grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
            words.forEach(placeWord);
            fillGrid();
            renderGrid();
            renderWords();
            document.getElementById('message').textContent = ''; // Limpiar el mensaje
        }

        

        function placeWord(word) {
            let placed = false;
            while (!placed) {
                const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
                const startRow = Math.floor(Math.random() * gridSize);
                const startCol = Math.floor(Math.random() * gridSize);
                if (direction === 'horizontal' && startCol + word.length <= gridSize) {
                    for (let i = 0; i < word.length; i++) {
                        if (grid[startRow][startCol + i] !== '' && grid[startRow][startCol + i] !== word[i]) {
                            break;
                        }
                        if (i === word.length - 1) placed = true;
                    }
                    if (placed) {
                        for (let i = 0; i < word.length; i++) {
                            grid[startRow][startCol + i] = word[i];
                        }
                    }
                } else if (direction === 'vertical' && startRow + word.length <= gridSize) {
                    for (let i = 0; i < word.length; i++) {
                        if (grid[startRow + i][startCol] !== '' && grid[startRow + i][startCol] !== word[i]) {
                            break;
                        }
                        if (i === word.length - 1) placed = true;
                    }
                    if (placed) {
                        for (let i = 0; i < word.length; i++) {
                            grid[startRow + i][startCol] = word[i];
                        }
                    }
                }
            }
        }

        function fillGrid() {
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    if (grid[row][col] === '') {
                        grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                    }
                }
            }
        }

        function renderGrid() {
            const table = document.getElementById('wordSearchGrid');
            table.innerHTML = '';
            for (let row = 0; row < gridSize; row++) {
                const tr = document.createElement('tr');
                for (let col = 0; col < gridSize; col++) {
                    const td = document.createElement('td');
                    td.textContent = grid[row][col];
                    td.dataset.row = row;
                    td.dataset.col = col;
                    td.onclick = () => handleClick(td);
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
        }

        function handleClick(cell) {
            cell.classList.toggle('found');
        }

        function renderWords() {
            const wordsList = document.getElementById('wordsList');
            wordsList.innerHTML = '';
            words.forEach(word => {
                const li = document.createElement('li');
                li.textContent = word;
                wordsList.appendChild(li);
            });
        }

        function checkWords() {
            const foundWords = new Set();
            const cells = document.querySelectorAll('td.found');
            cells.forEach(cell => {
                const row = parseInt(cell.dataset.row, 10);
                const col = parseInt(cell.dataset.col, 10);
                // Buscar palabras horizontalmente y verticalmente
                let horizontalWord = '';
                let verticalWord = '';
                for (let i = 0; i < gridSize; i++) {
                    // Horizontal
                    if (col + i < gridSize) {
                        horizontalWord += grid[row][col + i];
                    }
                    // Vertical
                    if (row + i < gridSize) {
                        verticalWord += grid[row + i][col];
                    }
                    if (words.includes(horizontalWord)) {
                        foundWords.add(horizontalWord);
                    }
                    if (words.includes(verticalWord)) {
                        foundWords.add(verticalWord);
                    }
                }
            });
            
            if (foundWords.size === words.length) {
                Swal.fire({
                    title:'congratulationss', 
                    icon:'success',
                    text:'Congratulations! You found all the words.',
                    confirmButtonText:'Close'
                })
            } else {
                Swal.fire({
                 title:'error',
                 icon:'warning',
                 text:`You are missing ${words.length - foundWords.size} words to find.`,
                 confirmButtonText: 'Close'
                })

            }
        }

        document.getElementById('resetButton').addEventListener('click', initializeGrid);
        document.getElementById('checkButton').addEventListener('click', checkWords);

        initializeGrid();