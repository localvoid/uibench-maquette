var maquette = require('maquette');
var h = maquette.h;
var projector = maquette.createProjector();

function onClick(e) {
  console.log('Clicked', e.currentTarget.xtag);
  e.stopPropagation();
}

function renderTableCell(text) {
  return h('td.TableCell', {xtag: text, onclick: onClick}, text);
}

function renderTableRow(data) {
  var cells = data.props;

  var children = [renderTableCell('#' + data.id)];
  for (var i = 0; i < cells.length; i++) {
    children.push(renderTableCell(cells[i]));
  }

  return h('tr.TableRow', {key: data.id, classes: {active: data.active}, 'data-id': data.id.toString()}, children);

}

function renderTable(data) {
  var items = data.items;

  var children = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    children.push(renderTableRow(item));
  }

  return h('table.Table', [h('tbody', children)]);
}

function renderAnimBox(data) {
  var time = data.time;
  var style = 'border-radius:' + (time % 10).toString() + 'px;' +
              'background:rgba(0,0,0,' + (0.5 + ((time % 10) /10)).toString() + ')';

  return h('div.AnimBox', {key: data.id, style: style, 'data-id': data.id.toString()});
}

function renderAnim(data) {
  var items = data.items;

  var children = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    children.push(renderAnimBox(item));
  }

  return h('div.Anim', children);
}

function renderTreeLeaf(data) {
  return h('li.TreeLeaf', {key: data.id}, data.id.toString());
}

function renderTreeNode(data) {
  var children = [];

  for (var i = 0; i < data.children.length; i++) {
    var n = data.children[i];
    if (n.container) {
      children.push(renderTreeNode(n));
    } else {
      children.push(renderTreeLeaf(n));
    }
  }

  return h('ul.TreeNode', {key: data.id}, children);
}

function renderTree(data) {
  return h('div.Tree', renderTreeNode(data.root));
}

function renderMain(data) {
  var location = data.location;

  var section;
  if (location === 'table') {
    section = renderTable(data.table);
  } else if (location === 'anim') {
    section = renderAnim(data.anim);
  } else if (location === 'tree') {
    section = renderTree(data.tree);
  }

  if (section === undefined) {
    return h('div.Main');
  }
  return h('div.Main', section);
}

uibench.init('Maquette', '2.3.3');

document.addEventListener('DOMContentLoaded', function(e) {
  var container = document.querySelector('#App');
  var projection = maquette.dom.create(h('div', (h('div.Main'))));
  container.appendChild(projection.domNode);

  uibench.run(
    function(state) {
      projection.update(h('div', renderMain(state)));
    },
    function(samples) {
      projection.update(h('div', h('pre', JSON.stringify(samples, null, ' '))));
    }
  );
});
