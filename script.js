const randint = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

//? Logica usada para criar o codigo de uma tecla
const calcCode = letter => {
    let i = 0;
    for(let l of letter)
        i += l.charCodeAt(0);
    return i;
}

const lines = 6; //? Representa o total de tentativas

const cellList = [];

const cellsHTML = document.querySelector('#Cells');

let currentLine = 0;
let currentLineIndex = 0;

let word = "";
let toDisplayWord = "";

//? Transfere o estilo de uma celula com o foco para a celula atual e retira da celula anterior
const changeFocus = (olderX, olderY) => {
    cellList[olderY][olderX].children[0].style.height = "4.7vw";

    // console.log(olderX, olderY);
    // console.log(currentLineIndex, currentLine);

    cellList[currentLine][currentLineIndex].children[0].style.height = "4.3vw";
}

//? Quando se clica em uma celula caso ela esteja contida na linha atual o valor de currentLineIndex
//? é substituido pela posição onde a celula se encontra em cellList[currentLine]
const onClick = e => {  
    const target = e.target;

    cellList[currentLine].forEach((element, index) => {
        if (target == element || target == element.children[0])
        {
            const olderX = currentLineIndex;
            currentLineIndex = index;
            changeFocus(olderX, currentLine);
            // console.log(olderX, currentLineIndex);
        }
           
    });
}

//? Forma mais enxuta de trocar o valor da celula atual
const changeCellContent = letter => cellList[currentLine][currentLineIndex].children[0].innerText = letter;

//? Forma mais enxuta de obter o valor da celula atual
const getCellContent = () => cellList[currentLine][currentLineIndex].children[0].innerText;

const currentTry = [...word]; //? Gera um array de "char" com o mesmo numero de elementos da palavra escolhida
currentTry.fill(' ');

//? Pinta uma celula de verde
const setCorrect = (x) => {
    cellList[currentLine][x].classList.add('Correct');
}

//? Pinta uma celular de amarelo
const setExists = (x) => {
    cellList[currentLine][x].classList.add('Exists');
}

//? Diminui a opacidade de uma linha
const setUsed = () => {
    cellsHTML.children[currentLine].style.opacity = 0.6;
}

//? Transforma os caracteres da resposta do usuario em uma string sem espaços vazios     
const currentTryToString = () => {
    let s = '';
    currentTry.forEach(e => { if(e != ' ') s+=e});

    return s;
}

//? Verifica as letras que foram digitadas em posições corretas ou que existem na palavra e faz a representação visual
const verifyLine = () => {
    const wordArray = [...word];
    const visited = [...word];
    visited.fill(false);

    for(let i = 0; i < wordArray.length; i++)
    {
        if(currentTry[i] == wordArray[i])
        {
            setCorrect(i);
            wordArray[i] = '';
            visited[i] = true;
        }
    }

    for(let i = 0; i < wordArray.length; i++)
    {
        const index = wordArray.indexOf( currentTry[i] );
        if(index != -1 && !visited[i])
        {
            setExists(i);
            wordArray[index] = '';
        }
    }

}

//? Setta a tela de final que representa se o jogo foi perdido ou vencido
const setScreen = (className, message, color) => {

    document.getElementsByTagName('body')[0].style.background = color; //'#6f1d1d';
    document.querySelector('#GranContainer').children[0].style.opacity = 0.6;


    const screen = document.createElement('div');
    
    screen.classList.add('Screen');
    screen.classList.add(className);

    screen.innerText = message;

    const ancor = document.createElement('a');
    const wordContainer = document.createElement('div'); const wordInsideContainer = document.createElement('div'); 
    wordInsideContainer.innerText = toDisplayWord;
    wordContainer.append(wordInsideContainer);
    wordInsideContainer.classList.add('InsideContainer' + className);
    wordContainer.classList.add('WordContainer');

    ancor.rel = "external"; ancor.target = "_blank"; ancor.title = "Buscar significado de " + toDisplayWord.toLowerCase();

    ancor.href = `https://www.google.com/search?q=${toDisplayWord.toLowerCase()}+significado`;
    ancor.append(wordContainer);
    screen.append(ancor);

    const orientation = ['left', 'right'][randint(0,2)];

    screen.style[orientation] = "200vw";
    
    document.getElementsByTagName('body')[0].append(screen);

    setTimeout(() => {
        screen.style[orientation] = "18vw";
    }, 100);
    setTimeout(() => {
        screen.style[orientation] = "25vw";
    }, 400);
}

//? Função que sera ativada a cada clique no teclado
const keyDown = e => {
    let letter = e.key.toUpperCase(); //? Obtem a tecla digitada em maisculo 
    let code = calcCode(letter); //? Obtem um numero unico que representa cada tecla partindo do somatorio dos valores 
                                 //? na tabela ascii dos elementos

    // console.log(code);

    if(code == 382 && currentTryToString().length == word.length) //? Condição de ENTER 
    {
        console.log(currentTryToString());
        const bool = currentTryToString() == word;

        verifyLine();

        if(bool) // Caso tenha vencido
        {
            setScreen('Winner', '¡Acertou!', '#006300');
            // cellsHTML.innerHTML = "Ganhou porra"
            onkeydown = ()=>{};
            return;
        }

        const olderX = currentLineIndex,
              olderY = currentLine;
        
        setUsed();

        currentLine++;
        currentLineIndex = 0;

        if(currentLine == lines) // Caso tenha perdido
        {
            setScreen('Loser', '¡Errou!', '#6f1d1d');
            onkeydown = ()=>{};
            return;
        }


        changeFocus(olderX, olderY);

        currentTry.fill(' ');
    }

    if(code == 637) //? Condição para BACKSPACE
    {
        if(currentLineIndex == 0 && getCellContent() == '') return; //? Ja na pos 0 não é possivel voltar nem apagar nada

        if(getCellContent() != '') //? Estando na ultima celula e ela sendo preenchida
                                   //? não se volta uma casa e apenas elimina o valor 
                                   //? ultima
        {
            currentTry[currentLineIndex] = ' ';
            changeCellContent(null);
        }     
        else //? Em qualquer outra situação se volta uma casa e deleta o elemento dessa casa
        {
            const olderX = currentLineIndex;
                
            currentLineIndex--;
            
            changeFocus(olderX, currentLine);
            
            currentTry[currentLineIndex] = ' ';
            changeCellContent(null);
        }
        return;
    }

    if(code == 694 && currentLineIndex > 0) //? Seta pra esquerda
    {
        const olderX = currentLineIndex;
    
        currentLineIndex--;

        changeFocus(olderX, currentLine);
    }
    else if(code == 777 && currentLineIndex < word.length-1) //? Seta pra direita
    {
        const olderX = currentLineIndex;
    
        currentLineIndex++;

        changeFocus(olderX, currentLine);
    }

    if(currentLineIndex == word.length - 1 && getCellContent() != '') //? Para evitar a constante troca de letra quando
                                                                      //? se esta com a ultima celula completa
        return;
    
    if(code >= 65 && code <= 90) //? Insere os valores caso sejam letras nas casas atuais
    {
        changeCellContent(letter);
        currentTry[currentLineIndex] = letter.charAt(0);
        // console.log(currentTryToString());
        
        if(currentLineIndex < word.length - 1) //? Caso não escape do index maximo se soma 1 ao index atual
        {
            const olderX = currentLineIndex;
    
            currentLineIndex++;
    
            changeFocus(olderX, currentLine);
        }
    }
}

//? Inicia as celulas
const setTable = () =>{
    for(let y = 0; y < lines; y++)
    {
        const aux = [];
        
        const line = document.createElement('div');
        
        line.classList.add('Line');

        for(let x = 0; x < word.length; x++) // Creates all the cells of the table
        {
            const cell = document.createElement('div');
            cell.classList.add('Cell');

            const letterContainer = document.createElement('div');
            letterContainer.classList.add('LetterContainer');

            cell.append(letterContainer);

            cell.addEventListener('click', (e) => onClick(e));

            aux.push(cell);
            line.append(cell);
        }
        cellsHTML.append(line);
        cellList.push(aux);
    }
}

//? Substitui caracteres com acento ou ç e pelos respectivos caracteres sem acentuação
const removeStrangeChar = (s) => {
    s = [...s];
    s = s.map((e) => {

        if(e == 'á' || e == 'â' || e == 'ã')
            return 'a';
        if(e == 'é' || e == 'ê' || e == 'ẽ')
            return 'e';
        if(e == 'í' || e == 'î' || e == 'ĩ')
            return 'i';
        if(e == 'ó' || e == 'ô' || e == 'õ')
            return 'o';
        if(e == 'ú' || e == 'û' || e == 'ũ')
            return 'u';
        if(e == 'ç')
            return 'c';

        return e;
    })

    let toReturn ="";

    s.forEach(e => toReturn += e);

    return toReturn;
}

//? Recursivamente busca uma palavra até com 4 < tamanho < 8 e sem ifem e quando acha se inicia a o jogo
const fetchData = () => {
    fetch('https://api.dicionario-aberto.net/random')
    .then(response => response.json())
    .then(d => {
        if(-1 != d['word'].indexOf('-') || d['word'].length > 8 || d['word'].length < 4)
        {
            fetchData()
        }
        else
        {
            toDisplayWord = d['word'].toUpperCase();
            word = removeStrangeChar(d['word'].toLowerCase()).toUpperCase();
            setTable();

            onkeydown = keyDown;
            changeFocus(0,0);
        }
    })
    .catch(err => console.log(err))
}

fetchData();
