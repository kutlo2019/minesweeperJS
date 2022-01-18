let width;
let bombAmount;

document.addEventListener('DOMContentLoaded', () => {

    // Game starter
    const startButton = document.getElementById('start-game')
    const gameCreate = document.querySelector('.create-game')
    const gameOn = document.querySelector('.game-on')
    const grid = document.querySelector('.grid')

    startButton.addEventListener('click', () => {
        const difficulty = document.querySelector('input[type="radio"]:checked');
        if (difficulty.value === 'Beginner') {
            width = 5
            bombAmount = 5
        } else if (difficulty.value === 'Intermediate') {
            width = 10
            bombAmount = 20
        } else if (difficulty.value === 'Expert') {
            width = 15
            bombAmount = 50
        }

        gameCreate.style.display = 'none'
        gameOn.style.display = 'block'
        // // Set the grid columns
        grid.style.display = 'grid'
        grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`

        createBoard()
    })
    
    let flags = 0
    let squares = []
    let isGameOver = false

    // create board
    function createBoard() {
        // get shuffled game aray with random bombs
        
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width*width - bombAmount).fill('valid')

        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)


        for (let i = 0; i < width*width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            // normal click
            square.addEventListener('click', function(e) {
                click(square)
            })

            // cntrl and left click
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        // add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) total++
                if (i > (width-1) && !isRightEdge && squares[i+1-width].classList.contains('bomb')) total++
                if (i > (width) && squares[i-width].classList.contains('bomb')) total++
                if (i > (width+1) && !isLeftEdge && squares[i-1-width].classList.contains('bomb')) total++
                if (i < (width*width-2) && !isRightEdge && squares[i+1].classList.contains('bomb')) total++
                if (i < (width*width-width) && !isLeftEdge && squares[i-1+width].classList.contains('bomb')) total++
                if (i < (width*width-width-2) && !isRightEdge && squares[i+1+width].classList.contains('bomb')) total++
                if (i < (width*width-width)-1 &&  squares[i+width].classList.contains('bomb')) total++
                squares[i].setAttribute('data', total)
            }
        }
    }

    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '&#128681'
                flags++
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
            }
        }

        
    }

    // click on squares actions
    function click(square) {
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked')
    }

    // check the neighbouring squares when square is clicked
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width -1 )

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId > (width - 1) && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId > width) {
                const newId = squares[parseInt(currentId) - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId > (width + 1) && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId < (width*width-2) && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId < (width*width - width) && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId < (width*width - width - 2) && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId < (width*width - width - 1)) {
                const newId = squares[parseInt(currentId) + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
        }, 10)
    }

    //  Game over
    function gameOver(square) {
        console.log('BOOM! Game Over!')
        isGameOver = true

        // Show all bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
            }
        })

        // Ask the user if he wants to play again
        const play = document.querySelector('.play-prompt')
        play.style.display = "block"

        yesButton = document.getElementById('yes')
        mainButton = document.getElementById('main')

        yesButton.addEventListener('click', () => {
            isGameOver = false
            squares = []
            grid.innerHTML = ''
            createBoard()
            play.style.display = "none"
        })

        mainButton.addEventListener('click', () => {
            isGameOver = false
            grid.innerHTML = ''
            document.querySelector('.game-on').style.display = "none"
            document.querySelector('.create-game').style.display = "flex"

        })



    }

    // check for win
    function checkForWin() {
        let matches = 0
        for (let i = 0; i<squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++
                const remainBombs = bombAmount - matches;
                document.getElementById('bombcount').innerHTML = remainBombs
            }

            if (matches === bombAmount) {
                console.log('YOU WIN!')
                isGameOver = true
            }
        }
    }
})