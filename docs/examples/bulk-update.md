---
layout: example.webc
title: Bulk Update
---

This demo shows how to implement a common pattern where rows are selected and then bulk updated. This is
accomplished by putting a form below a table, with associated checkboxes in the table, and then including the checked values in a `PUT` request to `/contacts`.

```html
<table id="contacts">
  <thead>
    <tr>
      <th scope="col">Edit</th>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><input type="checkbox" form="contacts_form" aria-label="Change Status" name="ids" value="0"></td>
      <td>Finn Mertins</td>
      <td>fmertins@candykingdom.gov</td>
      <td>Active</td>
    </tr>
    ...
  </tbody>
</table>
<form x-data x-ajax x-target="contacts" id="contacts_form" method="put" action="/contacts">
  <button name="status" value="Active">Activate</button>
  <button name="status" value="Inactive">Deactivate</button>
</form>
```

The server will either activate or deactivate the checked users and then rerender the `#contacts` table with
updated rows.

<script>
  let database = function () {
    let data = [
      { id: 1, name: "Finn", email: "fmertins@candykingdom.gov", status: "Active" },
      { id: 2, name: "Jake", email: "jake@candykingdom.gov", status: "Active" },
      { id: 3, name: "BMO", email: "bmo@moco.com", status: "Active" },
      { id: 4, name: "Marceline", email: "marceline@vampirequeen.me", status: "Inactive" }
    ];
    return {
      find: (id) => data.find(contact => contact.id === parseInt(id)),
      all: () => data,
    }
  }()

  document.addEventListener('DOMContentLoaded', () => {
    window.server({
      'GET /contacts': () => view(database.all()),
      'PUT /contacts': (formData) => {
        let ids = formData.getAll('ids') || []
        ids.forEach(id => {
          database.find(id)['status'] = formData.get('status');
        })
        return view(database.all());
      },
    }).get('/contacts')
  })

  function view(contacts) {
    let rows = contacts.map(contact => `<tr>
  <td><input type="checkbox" form="contacts_form" aria-label="Change Status" name="ids" value="${contact.id}"></td>
  <td>${contact.name}</td>
  <td>${contact.email}</td>
  <td>${contact.status}</td>
</tr>`).join('\n')

    return `<table id="contacts">
  <thead>
    <tr>
      <th scope="col">Edit</th>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>
<form x-data x-ajax x-target="contacts" id="contacts_form" method="put" action="/contacts">
  <button name="status" value="Active">Activate</button>
  <button name="status" value="Inactive">Deactivate</button>
</form>`
  }
</script>
