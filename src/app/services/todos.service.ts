import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../types/todo';

const API = 'https://jsonplaceholder.typicode.com/todos';

@Injectable({ providedIn: 'root' })
export class TodosService {
  constructor(private http: HttpClient) {}

  getTodos() {
    return this.http.get<Todo[]>(`${API}?userId=1`);
  }

  addTodo(todo: Omit<Todo, 'id'>) {
    return this.http.post<Todo>(API, todo);
  }

  updateTodo(id: number, data: Partial<Todo>) {
    return this.http.patch<Todo>(`${API}/${id}`, data);
  }

  deleteTodo(id: number) {
    return this.http.delete(`${API}/${id}`);
  }
}