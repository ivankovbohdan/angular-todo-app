import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Todo } from './types/todo';
import { TodoComponent } from './components/todo/todo.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodosService } from './services/todos.service';

// const todos = [
//   { id: 1, title: 'HTML + CSS', completed: true },
//   { id: 2, title: 'JS', completed: false },
//   { id: 3, title: 'React', completed: false },
//   { id: 4, title: 'Vue.js', completed: false },
// ];

type Filter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, FormsModule, ReactiveFormsModule, TodoComponent, TodoFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  todos: Todo[] = [];
  filter: Filter = 'all';

  private isServerTodo(id: number) {
    return id <= 200;
  }

  constructor(
    private todosService: TodosService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.todosService.getTodos().subscribe({
      next: todos => {
        this.todos = todos;
        this.cdr.markForCheck();
      },
      error: () => this.showError('Unable to load todos'),
    });
  }

  get activeTodos() {
    return this.todos.filter(todo => !todo.completed)
  }

  trackById(i: number, todo: Todo) {
    return todo.id;
  }

  addTodo(newTitle: string) {
    if (!newTitle.trim()) {
      this.showError('Title should not be empty');
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      title: newTitle,
      completed: false,
    }

    this.todos = [...this.todos, newTodo];
    this.todosService.addTodo({ title: newTitle, completed: false }).subscribe({
      error: () => this.showError('Unable to add a todo'),
    });
  }

  renameTodo(todoId: number, newTitle: string) {
    if (!newTitle.trim()) {
      this.showError('Title should not be empty');
      return;
    }

    this.todos = this.todos.map(todo => {
      if (todo.id !== todoId) {
        return todo;
      }

      return {
        ...todo,
        title: newTitle
      };
    })

    if (!this.isServerTodo(todoId)) return;

    this.todosService.updateTodo(todoId, { title: newTitle }).subscribe({
      error: () => this.showError('Unable to update a todo'),
    });
  }

  toggleTodo(todoId: number) {
    this.todos = this.todos.map(todo => {
      if (todo.id !== todoId) {
        return todo;
      }

      return {
        ...todo,
        completed: !todo.completed
      };
    })
    const updated = this.todos.find(t => t.id === todoId);

    if (!this.isServerTodo(todoId)) return;

    this.todosService.updateTodo(todoId, { completed: updated?.completed }).subscribe({
      error: () => this.showError('Unable to update a todo'),
    });
  }

  deleteTodo(todoId: number) {
    this.todos = this.todos.filter(todo => todo.id !== todoId)

    this.todosService.deleteTodo(todoId).subscribe({
      error: () => this.showError('Unable to delete a todo'),
    });
  }

  clearCompleted() {
    this.todos
      .filter(todo => todo.completed)
      .forEach(todo => this.deleteTodo(todo.id));
  }

  get visibleTodos() {
    switch (this.filter) {
      case 'active':
        return this.todos.filter(todo => !todo.completed);
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      default:
        return this.todos;
    }
  }

  setFilter(filter: Filter) {
    this.filter = filter;
  }

  error = '';

  showError(message: string) {
    this.error = message;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.error = '';
      this.cdr.markForCheck();
    }, 3000);
  }


}
