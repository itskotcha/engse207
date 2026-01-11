# Architecture Diagram

## High-Level Architecture

<img width="460" height="885" alt="Screenshot 2568-12-22 at 11 03 26" src="https://github.com/user-attachments/assets/cba25bae-b9a2-424f-82e9-7fa8f5897738" />


## Data Flow Example: Create Task

1. Client sends POST /api/tasks
   ↓
2. TaskController.createTask()
   - Validates HTTP request
   - Extracts data
   ↓
3. TaskService.createTask(data)
   - Validates business rules
   - Applies business logic
   ↓
4. TaskRepository.create(task)
   - Executes SQL INSERT
   - Returns created task
   ↓
5. Response flows back up
   Repository → Service → Controller → Client
