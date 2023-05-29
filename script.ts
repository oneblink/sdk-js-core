const fn = () => {
  const myStr = `
  <div>
    <div>sdfdsf{EXTERNAL_ID}dsfds</div>
    <div>{EXTERNAL_ID}</div>
  </div>
  `

  const valToReplace = '{EXTERNAL_ID}'
  console.log(myStr.replace(new RegExp(valToReplace, 'g'), 'Hello There'))
}

fn()
