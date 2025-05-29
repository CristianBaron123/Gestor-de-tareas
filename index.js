document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad para estados
    setupDropdowns('.status-dropdown', '.status-display', '.status-options', '.status-option', 'status');
    
    // Funcionalidad para prioridades
    setupDropdowns('.priority-dropdown', '.priority-display', '.priority-options', '.priority-option', 'priority');
  
    // Funcionalidad para fechas
    setupDateSelectors();
    
    // Funcionalidad para agregar tareas
    setupAddTaskFunctionality();
  
    // Funcionalidad para eliminar filas seleccionadas
    let checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.innerHTML = '🗑️ Eliminar';
    deleteBtn.style.display = 'none';
    deleteBtn.style.marginLeft = 'auto';
    document.querySelector('.actions').appendChild(deleteBtn);
    
    // Mostrar/ocultar botón de eliminar según selección
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateDeleteButton);
    });
    
    // Función para actualizar visibilidad del botón eliminar
    function updateDeleteButton() {
      const anyChecked = [...checkboxes].some(checkbox => checkbox.checked);
      deleteBtn.style.display = anyChecked ? 'block' : 'none';
    }
    
    // Función para eliminar filas seleccionadas
    deleteBtn.addEventListener('click', function() {
      const selectedRows = document.querySelectorAll('tbody tr input[type="checkbox"]:checked');
      
      selectedRows.forEach(checkbox => {
        if (!checkbox.closest('tr').classList.contains('add-task-row')) {
          checkbox.closest('tr').remove();
        }
      });
      
      deleteBtn.style.display = 'none';
      checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateDeleteButton);
      });
    });

    // Funcionalidad de búsqueda en tiempo real
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const rows = document.querySelectorAll('tbody tr:not(.add-task-row)');
      
      rows.forEach(row => {
        const taskName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const status = row.querySelector('.status-display').textContent.toLowerCase();
        const priority = row.querySelector('.priority-display').textContent.toLowerCase();
        
        if (taskName.includes(searchTerm) || status.includes(searchTerm) || priority.includes(searchTerm)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });

    // Funcionalidad de ordenamiento cíclico
    let currentSortOrder = 0;
    const sortBtn = document.querySelector('.sort-btn');
    
    sortBtn.addEventListener('click', function() {
        currentSortOrder = (currentSortOrder + 1) % 5;
        sortTasks(currentSortOrder);
    });
    
    function sortTasks(orderType) {
        const tbody = document.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr:not(.add-task-row)'));
        const addTaskRow = tbody.querySelector('.add-task-row');
        
        const statusOrder = {
            'done': 0,
            'in-progress': 1,
            'stopped': 2,
            'not-started': 3
        };
        
        const priorityOrder = {
            'urgent': 0,
            'high': 1,
            'medium': 2,
            'low': 3,
            'neutral': 4
        };
        
        rows.sort((a, b) => {
            const nameA = a.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const nameB = b.querySelector('td:nth-child(2)').textContent.toLowerCase();
            
            const statusA = a.querySelector('.status-display').dataset.status;
            const statusB = b.querySelector('.status-display').dataset.status;
            
            const dateA = a.querySelector('.selected-date').textContent;
            const dateB = b.querySelector('.selected-date').textContent;
            const dateValueA = dateA ? new Date(dateA) : null;
            const dateValueB = dateB ? new Date(dateB) : null;
            
            const priorityA = a.querySelector('.priority-display').dataset.priority;
            const priorityB = b.querySelector('.priority-display').dataset.priority;
            
            switch(orderType) {
                case 1: // Orden alfabético
                    return nameA.localeCompare(nameB);
                
                case 2: // Orden por estado
                    return statusOrder[statusA] - statusOrder[statusB];
                
                case 3: // Orden por fecha
                    if (!dateValueA && !dateValueB) return 0;
                    if (!dateValueA) return 1;
                    if (!dateValueB) return -1;
                    return dateValueA - dateValueB;
                
                case 4: // Orden por prioridad
                    return priorityOrder[priorityA] - priorityOrder[priorityB];
                
                default: // Orden original
                    return 0;
            }
        });
        
        rows.forEach(row => tbody.insertBefore(row, addTaskRow));
        updateSortButtonText();
    }
    
    function updateSortButtonText() {
        const sortTexts = [
            "↕️ Ordenar",
            "🔤 Alfabético",
            "🔄 Por Estado",
            "📅 Por Fecha",
            "⚠️ Por Prioridad"
        ];
        document.querySelector('.sort-btn').textContent = sortTexts[currentSortOrder];
    }

    function setupDropdowns(dropdownSelector, displaySelector, optionsSelector, optionSelector, dataAttribute, specificElement = null) {
      const elements = specificElement ? [specificElement] : document.querySelectorAll(dropdownSelector);
      
      elements.forEach(dropdown => {
        // Clonar elementos para limpiar eventos existentes
        const display = dropdown.querySelector(displaySelector);
        const options = dropdown.querySelector(optionsSelector);
        
        const newDisplay = display.cloneNode(true);
        const newOptions = options.cloneNode(true);
        
        display.replaceWith(newDisplay);
        options.replaceWith(newOptions);
        
        newDisplay.addEventListener('click', function(e) {
          e.stopPropagation();
          closeAllDropdowns(optionsSelector, newOptions);
          newOptions.style.display = newOptions.style.display === 'block' ? 'none' : 'block';
        });
        
        dropdown.querySelectorAll(optionSelector).forEach(option => {
          option.addEventListener('click', function(e) {
            e.stopPropagation();
            newDisplay.textContent = this.textContent;
            newDisplay.className = `${displaySelector.substring(1)} ${this.dataset[dataAttribute]}`;
            newDisplay.dataset[dataAttribute] = this.dataset[dataAttribute];
            newOptions.style.display = 'none';
          });
        });
      });
    }
  
    function setupDateSelectors(specificSelector = null) {
      const selectors = specificSelector ? [specificSelector] : document.querySelectorAll('.date-selector');
      
      selectors.forEach(selector => {
        // Clonar elemento para limpiar eventos existentes
        const newSelector = selector.cloneNode(true);
        if (!specificSelector) selector.replaceWith(newSelector);
        
        const calendarPopup = newSelector.querySelector('.calendar-popup');
        const monthYear = newSelector.querySelector('.month-year');
        const calendarGrid = newSelector.querySelector('.calendar-grid');
        const prevMonthBtn = newSelector.querySelector('.prev-month');
        const nextMonthBtn = newSelector.querySelector('.next-month');
        const todayBtn = newSelector.querySelector('.today-btn');
        const clearBtn = newSelector.querySelector('.clear-btn');
        const dateDisplay = newSelector.querySelector('.date-display');
        let selectedDateElement = newSelector.querySelector('.selected-date');
        const addIcon = newSelector.querySelector('.add-icon');
        const dateIcon = newSelector.querySelector('.date-icon');
        
        if (!calendarPopup || !monthYear || !calendarGrid || !dateDisplay) {
          return;
        }

        if (!selectedDateElement) {
          selectedDateElement = document.createElement('span');
          selectedDateElement.className = 'selected-date';
          selectedDateElement.style.display = 'none';
          dateDisplay.appendChild(selectedDateElement);
        }

        const state = {
          currentDate: new Date(),
          selectedDate: newSelector._currentDate || null,
          isOpen: false
        };

        function generateCalendar() {
          const year = state.currentDate.getFullYear();
          const month = state.currentDate.getMonth();
          
          monthYear.textContent = `${getMonthName(month)} ${year}`;
          
          const firstDay = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const daysInPrevMonth = new Date(year, month, 0).getDate();
          
          calendarGrid.innerHTML = '';
          
          ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].forEach(day => {
            const dayElement = document.createElement('span');
            dayElement.className = 'weekday';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
          });
          
          for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = document.createElement('span');
            dayElement.className = 'day other-month';
            dayElement.textContent = daysInPrevMonth - i;
            calendarGrid.appendChild(dayElement);
          }
          
          for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('span');
            dayElement.className = 'day';
            dayElement.textContent = day;
            
            const date = new Date(year, month, day);
            if (state.selectedDate && isSameDay(date, state.selectedDate)) {
              dayElement.classList.add('selected');
            }
            
            dayElement.addEventListener('click', function() {
              state.selectedDate = date;
              updateDateDisplay();
              renderCalendar();
              toggleCalendar(false);
            });
            
            calendarGrid.appendChild(dayElement);
          }
          
          const totalCells = 42;
          const remainingCells = totalCells - (firstDay + daysInMonth);
          for (let day = 1; day <= remainingCells; day++) {
            const dayElement = document.createElement('span');
            dayElement.className = 'day other-month';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
          }
        }
        
        function updateDateDisplay() {
          if (state.selectedDate) {
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            selectedDateElement.textContent = state.selectedDate.toLocaleDateString('es-ES', options);
            selectedDateElement.style.display = 'inline';
            if (addIcon) addIcon.style.display = 'none';
            if (dateIcon) dateIcon.style.display = 'none';
            newSelector.classList.add('has-date');
            newSelector._currentDate = new Date(state.selectedDate); // Clonar la fecha para evitar referencia
          } else {
            selectedDateElement.textContent = '';
            selectedDateElement.style.display = 'none';
            if (addIcon) addIcon.style.display = 'inline';
            if (dateIcon) dateIcon.style.display = 'inline';
            newSelector.classList.remove('has-date');
            newSelector._currentDate = null;
          }
        }
        
        function getMonthName(month) {
          const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          return months[month];
        }
        
        function isSameDay(date1, date2) {
          return date1.getDate() === date2.getDate() &&
                 date1.getMonth() === date2.getMonth() &&
                 date1.getFullYear() === date2.getFullYear();
        }
        
        function renderCalendar() {
          generateCalendar();
        }
        
        function toggleCalendar(show) {
          state.isOpen = show;
          calendarPopup.style.display = show ? 'block' : 'none';
          if (show) renderCalendar();
        }

        if (prevMonthBtn) {
          prevMonthBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            state.currentDate.setMonth(state.currentDate.getMonth() - 1);
            renderCalendar();
          });
        }
        
        if (nextMonthBtn) {
          nextMonthBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            state.currentDate.setMonth(state.currentDate.getMonth() + 1);
            renderCalendar();
          });
        }
        
        if (todayBtn) {
          todayBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            state.selectedDate = new Date();
            state.currentDate = new Date();
            updateDateDisplay();
            renderCalendar();
          });
        }
        
        if (clearBtn) {
          clearBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            state.selectedDate = null;
            updateDateDisplay();
            renderCalendar();
          });
        }
        
        if (addIcon) {
          addIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleCalendar(true);
          });
        }
        
        dateDisplay.addEventListener('click', function(e) {
          if (e.target === dateDisplay || 
              e.target.classList.contains('selected-date') || 
              e.target.classList.contains('date-icon')) {
            e.stopPropagation();
            toggleCalendar(!state.isOpen);
          }
        });
        
        document.addEventListener('click', function() {
          toggleCalendar(false);
        });
        
        calendarPopup.addEventListener('click', function(e) {
          e.stopPropagation();
        });
        
        renderCalendar();
        updateDateDisplay();
      });
    }
    
    function setupAddTaskFunctionality() {
        document.querySelectorAll('.add-task-inline').forEach(addTaskElement => {
          addTaskElement.addEventListener('click', function(e) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'add-task-input';
            input.placeholder = 'Nombre de la tarea';
            
            this.parentNode.replaceChild(input, this);
            input.focus();
            
            let enterPressed = false;
            
            input.addEventListener('keypress', function(e) {
              if (e.key === 'Enter') {
                enterPressed = true;
                handleFinish();
              }
            });
            
            input.addEventListener('blur', function() {
              if (!enterPressed) {
                handleFinish();
              }
            });
            
            function handleFinish() {
              if (input.value.trim() !== '') {
                addNewTask(input.value.trim());
              }
              const newAddButton = document.createElement('div');
              newAddButton.className = 'add-task-inline';
              newAddButton.textContent = '+ Agregar tarea';
              input.parentNode.replaceChild(newAddButton, input);
              setupAddTaskFunctionality();
            }
          });
        });
    }
    
    function addNewTask(taskName) {
        const tbody = document.querySelector('.task-group:first-child table tbody');
        
        // 1. Guardar TODOS los datos actuales ANTES de modificar el DOM
        const existingData = Array.from(document.querySelectorAll('tbody tr:not(.add-task-row)')).map(row => {
            const dateSelector = row.querySelector('.date-selector');
            return {
                status: row.querySelector('.status-display').dataset.status,
                priority: row.querySelector('.priority-display').dataset.priority,
                dateDisplay: dateSelector.querySelector('.selected-date').textContent,
                hasDate: dateSelector.classList.contains('has-date'),
                dateValue: dateSelector._currentDate ? new Date(dateSelector._currentDate) : null // Clonar la fecha
            };
        });

        // 2. Crear la nueva fila
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${taskName}</td>
            <td>
                <div class="status-dropdown">
                    <div class="status-display not-started" data-status="not-started">No iniciado</div>
                    <div class="status-options">
                        <div class="status-option" data-status="done" style="--status-color: #00C875;">Listo</div>
                        <div class="status-option" data-status="in-progress" style="--status-color: #FDAB3D;">En curso</div>
                        <div class="status-option" data-status="stopped" style="--status-color: #DF2F4A;">Detenido</div>
                        <div class="status-option" data-status="not-started" style="--status-color: #C4C4C4;">No iniciado</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="date-selector">
                    <div class="date-display">
                        <span class="date-icon">📅</span>
                        <span class="add-icon">➕</span>
                        <span class="selected-date" style="display: none;"></span>
                    </div>
                    <div class="calendar-popup">
                        <div class="calendar-header">
                            <button class="prev-month">◀</button>
                            <h3 class="month-year">Mayo 2023</h3>
                            <button class="next-month">▶</button>
                        </div>
                        <div class="calendar-grid"></div>
                        <div class="calendar-actions">
                            <button class="today-btn">Hoy</button>
                            <button class="clear-btn">Limpiar</button>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div class="priority-dropdown">
                    <div class="priority-display neutral" data-priority="neutral">—</div>
                    <div class="priority-options">
                        <div class="priority-option" data-priority="urgent" style="--priority-color: #444;">Urgente ⚠️</div>
                        <div class="priority-option" data-priority="high" style="--priority-color: #5b3cc4;">Alto</div>
                        <div class="priority-option" data-priority="medium" style="--priority-color: #5554c4;">Medio</div>
                        <div class="priority-option" data-priority="low" style="--priority-color: #4c84e3;">Bajo</div>
                        <div class="priority-option" data-priority="neutral" style="--priority-color: #bbb;">—</div>
                    </div>
                </div>
            </td>
        `;

        // 3. Insertar la nueva fila
        const addTaskRow = tbody.querySelector('.add-task-row');
        tbody.insertBefore(newRow, addTaskRow);

        // 4. Restaurar TODOS los datos de las filas existentes
        const existingRows = document.querySelectorAll('tbody tr:not(.add-task-row)');
        existingRows.forEach((row, index) => {
            if (index < existingData.length) {
                const data = existingData[index];
                
                // Restaurar estado
                const statusDisplay = row.querySelector('.status-display');
                statusDisplay.textContent = getStatusText(data.status);
                statusDisplay.className = `status-display ${data.status}`;
                statusDisplay.dataset.status = data.status;
                
                // Restaurar prioridad
                const priorityDisplay = row.querySelector('.priority-display');
                priorityDisplay.textContent = getPriorityText(data.priority);
                priorityDisplay.className = `priority-display ${data.priority}`;
                priorityDisplay.dataset.priority = data.priority;
                
                // Restaurar fecha (parte CRUCIAL)
                const dateSelector = row.querySelector('.date-selector');
                const selectedDate = dateSelector.querySelector('.selected-date');
                const addIcon = dateSelector.querySelector('.add-icon');
                const dateIcon = dateSelector.querySelector('.date-icon');
                
                if (data.hasDate && data.dateValue) {
                    dateSelector._currentDate = new Date(data.dateValue); // Clonar la fecha nuevamente
                    selectedDate.textContent = data.dateDisplay;
                    selectedDate.style.display = 'inline';
                    addIcon.style.display = 'none';
                    dateIcon.style.display = 'none';
                    dateSelector.classList.add('has-date');
                    
                    // Forzar actualización del calendario
                    const calendarPopup = dateSelector.querySelector('.calendar-popup');
                    if (calendarPopup.style.display === 'block') {
                        const state = {
                            currentDate: new Date(),
                            selectedDate: new Date(data.dateValue),
                            isOpen: true
                        };
                        dateSelector._state = state;
                        dateSelector.querySelector('.month-year').textContent = 
                            `${getMonthName(state.currentDate.getMonth())} ${state.currentDate.getFullYear()}`;
                    }
                } else {
                    selectedDate.textContent = '';
                    selectedDate.style.display = 'none';
                    addIcon.style.display = 'inline';
                    dateIcon.style.display = 'inline';
                    dateSelector.classList.remove('has-date');
                }
            }
        });

        // 5. Configurar solo los componentes de la NUEVA fila
        setupDropdowns('.status-dropdown', '.status-display', '.status-options', '.status-option', 'status', newRow.querySelector('.status-dropdown'));
        setupDropdowns('.priority-dropdown', '.priority-display', '.priority-options', '.priority-option', 'priority', newRow.querySelector('.priority-dropdown'));
        setupDateSelectors(newRow.querySelector('.date-selector'));

        // 6. Actualizar checkboxes
        const newCheckbox = newRow.querySelector('input[type="checkbox"]');
        newCheckbox.addEventListener('change', updateDeleteButton);
        checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    }
    
    // Funciones auxiliares para obtener textos
    function getStatusText(status) {
        const statusTexts = {
            'done': 'Listo',
            'in-progress': 'En curso',
            'stopped': 'Detenido',
            'not-started': 'No iniciado'
        };
        return statusTexts[status] || 'No iniciado';
    }
    
    function getPriorityText(priority) {
        const priorityTexts = {
            'urgent': 'Urgente ⚠️',
            'high': 'Alto',
            'medium': 'Medio',
            'low': 'Bajo',
            'neutral': '—'
        };
        return priorityTexts[priority] || '—';
    }
  
    document.addEventListener('click', function() {
      closeAllDropdowns('.status-options');
      closeAllDropdowns('.priority-options');
    });
  
    function closeAllDropdowns(selector, exception = null) {
      document.querySelectorAll(selector).forEach(dropdown => {
        if (dropdown && dropdown !== exception) {
          dropdown.style.display = 'none';
        }
      });
    }
}); 