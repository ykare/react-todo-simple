import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [
        // { id: 1, title: "リスト1", completed: true },
        // { id: 2, title: "リスト2", completed: false }
      ],
      newTodo: "",
      uid: 0,
      visibility: "all",
    };
  }

  // 入力フィールドの値が変更されたときの処理
  handleChange(event) {
    this.setState({ newTodo: event.target.value });
  }

  // ToDo リストの追加処理
  addTodo(event) {
    if (event.key !== "Enter") return;

    const newTodo = this.state.newTodo;
    const todos = this.state.todos.slice(); // todos 配列のコピーを取得
    let uid = this.state.uid;

    let value = newTodo && newTodo.trim();
    if (!value) {
      return;
    }
    todos.push({
      id: uid,
      title: value,
      completed: false
    });

    this.setState({ uid: ++uid, newTodo: "", todos: todos }); // state の更新
  }

  // ToDo リストの削除処理
  removeTodo(todo) {
    const todos = this.state.todos.slice(); // state の todos 配列をコピー

    todos.splice(todos.indexOf(todo), 1);

    this.setState({ todos: todos }); // state の更新
  }

  // 作業状態によりフィルタリングされた ToDo を返す
  filterdTodos() {
    const todos = this.state.todos;
    const visibility = this.state.visibility;
    return filters[visibility](todos);
  }

  // ToDo のチェックボックスの状態が変更されたときの処理
  handleCheckboxChange(item) {
    const todos = this.state.todos.slice(); // state の todos 配列をコピー
    item.completed = !item.completed;

    this.setState({ todos: todos }); // state の更新
  }

  // 作業状態のラジオボタンがクリックされたときの処理
  handleFilter(event) {
    const visibility = event.target.value;
    this.setState({ visibility: visibility });
  }

  // 描画メソッド
  render() {
    // フィルタリングされた todos を取得
    const todos = this.filterdTodos();

    // todos 配列から <li> の配列に変換
    const todoList = todos.map((item, index) => {
      // item オブジェクトを元に <li> を返す
      const id = item.id;
      const title = item.title;
      const completed = item.completed ? { className: "completed" } : {};
      const checked = item.completed ? { defaultChecked: true } : {}

      return (
        <li key={id} {...completed}>
          <div className="view">
            <label>
              <input className="toggle" type="checkbox" {...checked} onChange={() => this.handleCheckboxChange(item)} />
              {title}
            </label>
            <button className="remove" onClick={() => this.removeTodo(item)}>削除</button>
          </div>
        </li >
      );
    });

    return (
      <div className="App" >
        <section className="todoapp">
          <header className="header">
            <h1>ToDo リスト</h1>
            <input
              className="new-todo"
              placeholder="追加する ToDo を入力してください"
              autoFocus
              autoComplete="off"
              value={this.state.newTodo}
              onChange={event => this.handleChange(event)}
              // onKeyUp={event => this.addTodo(event)} Firefox だと IME 確定時にも呼び出されてしまう。。。
              onKeyDown={event => this.addTodo(event)}
            />
          </header>
          <section className="main">
            <ul className="todo-list">
              {todoList}
            </ul>
          </section>
          <footer className="footer">
            <span className="todo-count"><strong>{todos.length}</strong> 件を表示</span>
            <label><input className="radio" name="filter" type="radio" value="all" onChange={event => this.handleFilter(event)} defaultChecked />すべて</label>
            <label><input className="radio" name="filter" type="radio" value="active" onChange={event => this.handleFilter(event)} />作業中</label>
            <label><input className="radio" name="filter" type="radio" value="completed" onChange={event => this.handleFilter(event)} />完了</label>
          </footer>
        </section>
      </div>
    );
  }
}

// 作業状態によるフィルタリングを行うヘルパー関数
let filters = {
  all: function (todos) {
    return todos;
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed;
    });
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.completed;
    });
  }
};

export default App;
