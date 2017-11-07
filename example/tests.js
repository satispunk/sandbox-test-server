import {t} from 'testcafe'
import ReactSandbox from '../src/server'

fixture(`Example`)

test('load page', async () => {
  const testUuid = await ReactSandbox.registerElement(`
<div className="new">
    Hello from test
</div>
  `)
  
  await t.navigateTo(`http://localhost:3000/${testUuid}`)
  await t.wait(100000)
})