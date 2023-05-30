const button = document.getElementById('purchase');

button.addEventListener('click', async e=>{
    e.preventDefault();
    const response = await fetch('/api/cart/purchase',{
        method:'POST'
    })
    const result = await response.json();
    console.log(result);
    if(result.status === 'success') window.location.replace('/ticket')
})