
///<!--Insertid-->

function insertid () {
    cleartable();
    let field = document.getElementById('steamid')
    field.value = '76561198041677591'
    document.getElementById('my--id--button').disabled = true
    sender();
};


///<!--Sender-->

async function sender() {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    let steamid = document.getElementById('steamid').value;
    let data = {'steamid': steamid };

    let loading_div = document.getElementById('upper');
    loading_div.insertAdjacentHTML('beforeEnd', 
        `<div class="spinner spinner-border spinner-border-sm" role="status>
            <span id="spinner" class="sr-only spinner"></span>
            </div>`)

    let response = await fetch('/ajax',
        {
        method: 'POST',
        body: JSON.stringify(data),
        headers : {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrftoken,
        },
        });

        let response_text = await response.json();

        var arr = []
        for (const [key, value] of Object.entries(response_text)) {
        arr.push(value);
        }

        const elements = document.getElementsByClassName('tableelement');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }

        let div = document.getElementById('tablebody');
        for (const game of Object.entries(arr[0])) {
        div.insertAdjacentHTML('beforeEnd', 
        `<tr class='tableelement'>
            <td>${game[1]['name']}</td>
            <td><a href="${game[1]['steamlink']}">${game[1]['price']}</a></td>
            <td><a href="${game[1]['shopgamelink']}">${game[1]['rubprice']}</a></td>
            <td><a href="${game[1]['shopsearchlink']}">${game[1]['shopsearchlink']}</a></td>
        </tr>`)
    }

    const spinners = document.getElementsByClassName('spinner');
        while(spinners.length > 0){
        spinners[0].parentNode.removeChild(spinners[0]);
        }

        document.getElementById('my--id--button').disabled = false

}


///<!--Clear table-->

function cleartable(){
    // Clear the table
    document.getElementById('my--id--button').disabled = false
    const toclear = document.getElementsByClassName('tableelement');
    while(toclear.length > 0){
        toclear[0].parentNode.removeChild(toclear[0]);
    }
    // Clear steam id field
    let field = document.getElementById('steamid')
    field.value = ''
    // Clear hidden flag elements for table reverse sorting
    var hidden_elements = document.getElementsByClassName('column-flag')
    for (var i=0; i < hidden_elements.length; i++) {
        hidden_elements[i].value = '';
    }
    // Clear sorting icons
    var hidden_elements = document.getElementsByClassName('bi')
    for (var i=0; i < hidden_elements.length; i++) {
        hidden_elements[i].style.display = 'none';
    }

    const spinners = document.getElementsByClassName('spinner');
        while(spinners.length > 0){
        spinners[0].parentNode.removeChild(spinners[0]);
        }
};


///<!--Sort table-->

function sortTable(number) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("table");
    switching = true;

    var re = RegExp('>(.*?)<')
    let present_column = document.getElementById(`column${number}`)
    let present_column_val = present_column.value
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[number];
        y = rows[i + 1].getElementsByTagName("TD")[number];
        
        if (number == 1 && present_column.value != 'sorted') {
            // Check if the two rows should switch place:
            if (parseFloat(re.exec(x.innerHTML.toLowerCase())[1]) < parseFloat(re.exec(y.innerHTML.toLowerCase())[1])) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        else if (number == 0 && present_column.value != 'sorted') {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        else if (present_column.value != 'sorted') {
            if (re.exec(x.innerHTML.toLowerCase())[1] < re.exec(y.innerHTML.toLowerCase())[1]) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        else if (number == 1 && present_column.value == 'sorted') {
            // Check if the two rows should switch place:
            if (parseFloat(re.exec(x.innerHTML.toLowerCase())[1]) > parseFloat(re.exec(y.innerHTML.toLowerCase())[1])) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        else if (number == 0 && present_column.value == 'sorted') {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        else if (present_column.value == 'sorted') {
            if (re.exec(x.innerHTML.toLowerCase())[1] > re.exec(y.innerHTML.toLowerCase())[1]) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        }
        if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        }
    }

    // Clear hidden flag elements for table reverse sorting
    var hidden_elements = document.getElementsByClassName('column-flag')
    for (var i=0; i < hidden_elements.length; i++) {
        hidden_elements[i].value = '';
    }

    // Clear sorting icons
    var hidden_elements = document.getElementsByClassName('bi')
    for (var i=0; i < hidden_elements.length; i++) {
        hidden_elements[i].style.display = 'none';
    }

    // Change current column flag and icon
    if (present_column_val == 'sorted') {

        document.getElementById(`sort-icon-sorted${number}`).style.display = 'none'
        document.getElementById(`sort-icon${number}`).style.display = 'inline-block'
        present_column.value = ''

    }
    else if (present_column_val != 'sorted') {
        document.getElementById(`sort-icon-sorted${number}`).style.display = 'inline-block'
        document.getElementById(`sort-icon${number}`).style.display = 'none'
        present_column.value = 'sorted'
    }
}


///<!--Theme change-->

let root = document.querySelector(":root");
let button = document.querySelector("#themeToggle");

button.addEventListener('click', () => {
    event.preventDefault();
    root.classList.toggle('dark');
    if (themeToggle.textContent == 'Dark') {
    themeToggle.textContent = 'Light';
    } else {
    themeToggle.textContent = 'Dark';
    }
})

