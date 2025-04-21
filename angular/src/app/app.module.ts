import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { jsPlumbToolkitModule } from "@jsplumbtoolkit/browser-ui-angular"

import { AppComponent } from './app.component';
import {ColumnComponent} from "./column.component"
import {KanbanComponent} from "./kanban.component"
import {ItemComponent} from "./item.component"
import {KanbanInspectorComponent} from "./inspector.component"

@NgModule({
  declarations: [
    AppComponent, ColumnComponent, ItemComponent, KanbanComponent, KanbanInspectorComponent
  ],
  imports: [
    BrowserModule, jsPlumbToolkitModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
