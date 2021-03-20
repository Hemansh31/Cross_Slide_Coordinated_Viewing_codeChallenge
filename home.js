function toggle(str){
    const c1 = document.getElementById('s1');
    const c2 = document.getElementById('s2');
    const c3 = document.getElementById('s3');
    const c4 = document.getElementById('s4');
    count = 0;
    if(c1.checked){
        count += 1;
    }
    if(c2.checked){
        count += 1;
    }
    if(c3.checked){
        count += 1;
    }
    if(c4.checked){
        count += 1;
    }
    console.log(count);
    if(str === 's1'){
        if(count > 2){
            c1.checked = false;
            count -= 1;
            alert("You can select only two slides. To select this slide deselect another slide");
        }
    }
    if(str === 's2'){
        if(count > 2){
            c2.checked = false;
            count -= 1;
            alert("You can select only two slides. To select this slide deselect another slide");
        }
    }
    if(str === 's3'){
        if(count > 2){
            c3.checked = false;
            count -= 1;
            alert("You can select only two slides. To select this slide deselect another slide");
        }
    }
    if(str === 's4'){
        if(count > 2){
            c4.checked = false;
            count -= 1;
            alert("You can select only two slides. To select this slide deselect another slide");
        }
    }
}

document.getElementById("viewSlides").addEventListener("click", function(event){
    event.preventDefault();
    const checkedBoxes = [];
    const c1 = document.getElementById('s1');
    const c2 = document.getElementById('s2');
    const c3 = document.getElementById('s3');
    const c4 = document.getElementById('s4');
    if(c1.checked){
        checkedBoxes.push(0);
    }
    if(c2.checked){
        checkedBoxes.push(1);
    }
    if(c3.checked){
        checkedBoxes.push(2);
    }
    if(c4.checked){
        checkedBoxes.push(3);
    }
    if(checkedBoxes.length < 2){
        alert("Please Select Two Slides for Cross Slide Viewing");
        location.reload();
    } else{
        var page = 'viewer.html?' + checkedBoxes.toString();
        console.log(page);
        window.open(page, '_self');
    }
});