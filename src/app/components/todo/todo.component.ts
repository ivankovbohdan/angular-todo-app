import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../types/todo';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent implements OnChanges {
  @Output() delete = new EventEmitter();
  @Output() toggle = new EventEmitter();
  @Output() rename = new EventEmitter<string>();

  @Input() todo!: Todo

  @ViewChild('titleField') 
  set titleField(field: ElementRef) {
    if (field) {
      field.nativeElement.focus();
    }
  }

  editing = false;
  title = '';

  constructor() {

  }

  ngOnChanges({ todo }: SimpleChanges): void {
    if (todo.currentValue.title !== todo.previousValue?.title) {
      this.title = todo.currentValue.title;
    }
  }

  edit() {
    this.editing = true;
    this.title = this.todo.title;
  }

  save() {
    if(!this.editing){
      return;
    }

    this.editing = false;
    this.rename.emit(this.title);
  }

}
