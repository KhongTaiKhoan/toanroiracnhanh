let deBai = '';
// let countApha = 0;
let countSpe = 0;


$('.toan-tu').on('click',(e)=>{
    let insert_ = $(e.currentTarget).html().trim();
    if(insert_==='TRUE')insert_=1;
    if(insert_==='FALSE')insert_=0;
    $('#noi-dung').append(insert_);

    let el = document.getElementById("noi-dung");
    let range = document.createRange();
    let sel = window.getSelection();
 
  
    // console.log($('#noi-dung').html().length)
    range.setStart(el, $('#noi-dung').html().length-countSpe);

    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    deBai+= insert_;
    countSpe ++;
    // count++;
})

$('#noi-dung').on('forcus');


$('#noi-dung').on('keyup',e=>{
    if(e.keyCode === 32){ return;}
    // let inp = String.fromCharCode(e.keyCode);
    // if (/[a-zA-Z0-9-_ ]/.test(inp)){
    //    deBai+= e;
    // //    console.log(e.key);
    // //    count++;
    // }
    // console.log(e.keyCode);
    // if(e.key === 56 || e.key === 48) countSpe = 0;
    deBai = $('#noi-dung').html();
})

$('#nop').on('click', e => {
    $('.bai-giai').removeClass('d-none');
    $('#chi-tiet-loi-giai').html('');
    if(deBai === '' && $('#so-luong-bien').html() === ''){
        $('#chi-tiet-loi-giai').append('Hãy nhập số lượng biến, lưu ý số lượng biến từ 3 đến 5 biến!');
        return;
    }
    let data = deBai === ''?$('#chuoi-input').html() +','+$('#so-luong-bien').html() : deBai;
    console.log(data);
    $.ajax({
        method: "POST",
        url: '/rut-gon-ham-boolean',
        data: {
            deBai: data
        }
    }).done(rs => {
       if(rs.mes===true){
           /// BIEU DIEN LAI DE BAI
           $('#chi-tiet-loi-giai').append('<div>Lời giải tri tiết</div>');
           $('#chi-tiet-loi-giai').append('<div class ="mt-2">Biểu diễn lại đề bài:</div>');
           let m = rs.deBai.split('∨');
           rs.deBai = '';
           for (let i = 0; i < m.length; i++) {
               if (i === m.length - 1) {
                   rs.deBai += m[i]
               } else {
                   rs.deBai += m[i] + " " + "∨" + " ";
               }
           }
           console.log(rs.teBaoLon);
           $('#chi-tiet-loi-giai').append(`<div class ="mt-2"><b>Biểu thức:</b> ${rs.deBai}</div>`);
           $('#chi-tiet-loi-giai').append(`<div class ="mt-2">${bieuDienBangKarnaugh(rs.bienCoSo, rs.maTran,rs.mangDanhDau)}</div>`);
           $('#chi-tiet-loi-giai').append(`<div class ="mt-5"><b>Các tế bào lớn bao gồm ${rs.teBaoLon.length} tế bào: </b></div>`);
           for (let i = 0; i < rs.teBaoLon.length; i++) {
               $('#chi-tiet-loi-giai').append(`<div><a href='#te-bao-${i}' data-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseExample">- ${rs.bieuThucLonChuyenDoi[i]}</a></div>`);
               $('#chi-tiet-loi-giai').append(`<div class="collapse" id='te-bao-${i}'>${bieuDienBangKarnaugh(rs.bienCoSo, rs.maTran, rs.teBaoLon[i])}</div>`);
            }
            
            $('#chi-tiet-loi-giai').append('<div class ="mt-5 mb-3"><b>Các tế bào rút gọn tối ưu: </b></div>');
            for (let i = 0; i < rs.bieuThucChuyenDoi.length; i++) {
                $('#chi-tiet-loi-giai').append(`<div><b>- ${rs.bieuThucChuyenDoi[i]}</b></div>`);
            }

       }
       else {
           $('#chi-tiet-loi-giai').append('Không thể giải tiếp được,mời xem lại đề bài!');
       }
    })
})



function bieuDienBangKarnaugh(bienCoSo,maTran,danhDau){
    let table = '';
    if(bienCoSo.length === 3) table=bia3Bien(bienCoSo,maTran,danhDau);
    if(bienCoSo.length === 4) table=bia4Bien(bienCoSo,maTran,danhDau);
    if(bienCoSo.length === 5) table=bia5Bien(bienCoSo,maTran,danhDau);
    if(table==='')
    return "Số biến chỉ hỗ trợ 3,4,và 5 biến";
    return table;
}

function bia3Bien(bienCoSo,maTran,danhDau=undefined) {
    let row = [`¬${bienCoSo[2]}`, `${bienCoSo[2]}`];
    let table =
        ` <div class="row">
    <!-- BANG MOT -->
    <div class="col">
      <div class="ma-tran">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">¬${bienCoSo[0]}¬${bienCoSo[1]}</th>
              <th scope="col">¬${bienCoSo[0]}${bienCoSo[1]}</th>
              <th scope="col">${bienCoSo[0]}${bienCoSo[1]}</th>
              <th scope="col">¬${bienCoSo[0]}${bienCoSo[1]}</th>
            </tr>
          </thead>
          <tbody>`;
    for (let i = 0; i < maTran[0].length; i++) {
        table+='<tr>'
        table += `<th scope="row">${row[i]}</th>`;
        for (let j = 0; j < maTran[0][i].length; j++) {
            if(danhDau !== undefined && danhDau.includes(maTran[0][i][j]))
            table += `<td class = 'cell-active'>${maTran[0][i][j]}</td>`;
            else if(maTran[0][i][j]===-1)
            table += `<td>0</td>`;
            else 
            table += `<td>${maTran[0][i][j]}</td>`;

        }
        table+='</tr>'
    }

    table +=
        `</tbody>
        </table>
      </div>
    </div>
  </div>`;
    return table;
}

function bia4Bien(bienCoSo,maTran,danhDau=undefined) {
    let row = [ `¬${bienCoSo[2]}¬${bienCoSo[3]}`,
                `¬${bienCoSo[2]}${bienCoSo[3]}`,
                `${bienCoSo[2]}${bienCoSo[3]}`,
                `${bienCoSo[2]}¬${bienCoSo[3]}`,];
    let table =
        ` <div class="row">
    <!-- BANG MOT -->
    <div class="col">
      <div class="ma-tran">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">¬${bienCoSo[0]}¬${bienCoSo[1]}</th>
              <th scope="col">¬${bienCoSo[0]}${bienCoSo[1]}</th>
              <th scope="col">${bienCoSo[0]}${bienCoSo[1]}</th>
              <th scope="col">¬${bienCoSo[0]}${bienCoSo[1]}</th>
            </tr>
          </thead>
          <tbody>`;
    for (let i = 0; i < maTran[0].length; i++) {
        table+='<tr>'
        table += `<th scope="row">${row[i]}</th>`;
        for (let j = 0; j < maTran[0][i].length; j++) {
            if(danhDau !== undefined && danhDau.includes(maTran[0][i][j]))
            table += `<td class = 'cell-active'>${maTran[0][i][j]}</td>`;
            else if(maTran[0][i][j]===-1)
            table += `<td>0</td>`;
            else 
            table += `<td>${maTran[0][i][j]}</td>`;

        }
        table+='</tr>';
    }

    table +=
        `</tbody>
        </table>
      </div>
    </div>
  </div>`;
    return table;
}

function bia5Bien(bienCoSo,maTran,danhDau=undefined) {
    let row = [ `¬${bienCoSo[3]}¬${bienCoSo[4]}`,
                `¬${bienCoSo[3]}${bienCoSo[4]}`,
                `${bienCoSo[3]}${bienCoSo[4]}`,
                `¬${bienCoSo[3]}${bienCoSo[4]}`,];
    let table =
        ` <div class="row">
    <!-- BANG MOT -->
    <div class="col">
      <div class="ma-tran">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">¬${bienCoSo[1]}¬${bienCoSo[2]}</th>
              <th scope="col">¬${bienCoSo[1]}${bienCoSo[2]}</th>
              <th scope="col">${bienCoSo[1]}${bienCoSo[2]}</th>
              <th scope="col">¬${bienCoSo[1]}${bienCoSo[2]}</th>
            </tr>
          </thead>
          <tbody>`;
    for (let i = 0; i < maTran[0].length; i++) {
        table+='<tr>'
        table += `<th scope="row">${row[i]}</th>`;
        for (let j = 0; j < maTran[0][i].length; j++) {
            if(danhDau !== undefined && danhDau.includes(maTran[0][i][j]))
            table += `<td class = 'cell-active'>${maTran[0][i][j]}</td>`;
            else if(maTran[0][i][j]===-1)
            table += `<td>0</td>`;
            else 
            table += `<td>${maTran[0][i][j]}</td>`;

        }
        table+='</tr>'
    }

    table +=
        `</tbody>
        </table>
      </div>
      <div class="text-center">¬${bienCoSo[0]}</div>
    </div>`;
   
    table+=`<!-- BANG HAI -->
    <div class="col">
      <div class="ma-tran">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">¬${bienCoSo[1]}¬${bienCoSo[2]}</th>
              <th scope="col">¬${bienCoSo[1]}${bienCoSo[2]}</th>
              <th scope="col">${bienCoSo[1]}${bienCoSo[2]}</th>
              <th scope="col">¬${bienCoSo[1]}${bienCoSo[2]}</th>
            </tr>
          </thead>
          <tbody>`;
    for (let i = 0; i < maTran[1].length; i++) {
        table+='<tr>'
        table += `<th scope="row">${row[i]}</th>`;
        for (let j = 0; j < maTran[1][i].length; j++) {
            if(danhDau !== undefined && danhDau.includes(maTran[1][i][j]))
            table += `<td class = 'cell-active'>${maTran[1][i][j]}</td>`;
            else if(maTran[1][i][j]===-1)
            table += `<td>0</td>`;
            else 
            table += `<td>${maTran[1][i][j]}</td>`;
        }
        table+='</tr>'
    }

    table +=
        `</tbody>
        </table>
      </div>
      <div class="text-center">${bienCoSo[0]}</div>
    </div> </div>`;
    return table;
}
