// Storage Controller
const StorageCtrl = (function(){
    // public methods
    return {
        storeItem: function(newItem){
            let items;
            // check if any items in LS
            if(localStorage.getItem('items') === null){
                items = [];
                // push new item
                items.push(newItem);

                // set LS 
                localStorage.setItem('items', JSON.stringify(items));
            } else{
                items = JSON.parse(localStorage.getItem('items'));
                items.push(newItem);
                 // set LS 
                 localStorage.setItem('items', JSON.stringify(items));
            }
            
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },
        updateItemsFromStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

//Item Controller
const ItemCtrl = (function(){
   // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data structure / state
    const data = {
        // items: [
        //     // {id: 0, name: 'Steak', calories: 1200},
        //     // {id: 1, name: 'Bread', calories: 400},
        //     // {id: 2, name: 'Eggs', calories: 300},
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function(){
            return data.items;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;
            data.items.forEach(function(item){
                total += item.calories;
            });

            data.totalCalories = total;

            return data.totalCalories;
        },
        getItemById: function(id) {
            let found = null;
            //loop through item
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });

            return found;
        },
        updateItem: function(name, calories){
            // calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;

        },
        deleteItem: function(id){
            // get ids
            ids = data.items.map(function(item){
                return item.id;
            });
            // get index
            const index = ids.indexOf(id);
            
            // remove item
            data.items.splice(index, 1);

        },
        clearAllItems: function(){
            data.items = [];
        },
        addItem: function(name, calories){
            // create id
            let ID;
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // calories to number
            calories = parseInt(calories);

            // create new item
            newItem = new Item(ID, name, calories);

            data.items.push(newItem);

            return newItem;
        }
    }
})();




// UI Controller
const UICtrl = (function(){

    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        listItems: '#item-list li',
        clearBtn: '.clear-btn',
    }
   
    return {
        populateItemList: function(items){
            let html = '';

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a> 
            </li>`;
            });

            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            // show list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            // insert li to ul
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)

        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // convert node list to array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemId = listItem.getAttribute('id');

                if(itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            })
        },
        deleteListItem: function(id){
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);

            item.remove();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn node to array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';

        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories; 
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        }, 
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState(); 
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();



// App Controller
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl){
    // load event listeners
    const loadEventListeners = function(){
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    
        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        
        //disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });
        // update item 
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

         // delete button event
         document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // back button event 
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

         // clear all button event 
         document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);


    }

    const itemAddSubmit = function(e) {
        // get form input from UI controller
        const input = UICtrl.getItemInput();
        // check for name and calorie input
        if(input.name !== '' && input.calories !== ''){
            //add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
           
            //add item to UI
            UICtrl.addListItem(newItem);
            
            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // show in UI
            UICtrl.showTotalCalories(totalCalories);

            // store in LS
            StorageCtrl.storeItem(newItem);

            //clear fields
            UICtrl.clearInput();
        } 
        e.preventDefault();
    }

    // Edit click 
    const itemEditClick = function(e) {
        //event delegation
        if(e.target.classList.contains('edit-item')){
            // get list item id
            const listId = e.target.parentNode.parentNode.id;
            
            // break into an array
            const listIdArr = listId.split('-');

            //get the actual id
            const id = parseInt(listIdArr[1]);

            //get the entire item
            const itemToEdit = ItemCtrl.getItemById(id);

            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //add item to form
            UICtrl.addItemToForm();
        }
        
        
        e.preventDefault();
    };

    const itemUpdateSubmit = function(e) {
        const input = UICtrl.getItemInput();
        // updated item

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // update ui 
        UICtrl.updateListItem(updatedItem);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // show in UI
        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.updateItemsFromStorage(updatedItem);

        UICtrl.clearEditState();


        e.preventDefault();
    };

    const itemDeleteSubmit = function(e) {
        // get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //delete from ui
        UICtrl.deleteListItem(currentItem.id);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // show in UI
        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
        
    };

    // clear items event

    const clearAllItemsClick = function() {
        // delete all items from data structure
        ItemCtrl.clearAllItems();

        const totalCalories = ItemCtrl.getTotalCalories();

        // show in UI
        UICtrl.showTotalCalories(totalCalories);
        // remove form ui
        UICtrl.removeItems();

        StorageCtrl.clearItemsFromStorage();

        // Hide list ul
        UICtrl.hideList();

    }
    

   return {
       init: function(){
           //clear edit state
           UICtrl.clearEditState();
           //fetch items from data structure
           const items = ItemCtrl.getItems();
           // check if any items
           if(items.length === 0){
               UICtrl.hideList();
           } else {
               //populate list with items
               UICtrl.populateItemList(items);
           }

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // show in UI
            UICtrl.showTotalCalories(totalCalories);

           // load event listeners
           loadEventListeners();
       }

   }
})(ItemCtrl, StorageCtrl, UICtrl);


AppCtrl.init()


