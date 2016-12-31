let path = require("path");

function repeat_str(s, n){
    return (new Array(n+1)).join(s);
}

function format_str(s, n){
    let sl = s.length;
    let r = s + repeat_str(' ', n-sl-2);
    return ' '+r+' ';
}

function print_table(header, data){
    let row_len = (new Array(header.length)).fill(0);
    row_len = row_len.map((x,i)=>header[i].length);

    data.forEach(function(v){
        v.forEach(function(s, i){
            row_len[i] = Math.max(row_len[i], s.length);
        });
    });

    let row_len_space = row_len.map(x=>x+2);
    let line_sep = '+'+row_len_space.map(x=>repeat_str('-', x)).join('+')+'+';
    let header_line = '|'+header.map((x,i)=>format_str(x,row_len_space[i])).join('|')+'|';
    let data_lines = data.map(function(v){
        return '|'+v.map((x,i)=>format_str(x,row_len_space[i])).join('|')+'|';
    });

    let lines = [line_sep, header_line, line_sep].concat(data_lines, line_sep);
    return lines.join('\n');
}



function visit_route(f_path_route, route, prefix){
    let abs_path = route.path || '';
    let full_path = path.join(prefix, abs_path);
    f_path_route(full_path, route);
    let childRoutes = route.childRoutes || [];

    childRoutes.forEach(function(v){
        visit_route(f_path_route, v, full_path);
    });
}

function default_route_to_tuple(path,route){
    return [path,''+route.component];
}

function printRouteToString(route, prefix='/', route_to_tuple=default_route_to_tuple){
    let data = [];
    function collect_route(path, route){
        data = data.concat([route_to_tuple(path, route)]);
    }
    visit_route(collect_route, route, prefix);
    data.sort(function(a,b){
        return a[0].localeCompare(b[0]);
    });

    return print_table(['Path', 'Name'], data);
}

module.exports = {
    printRouteToString
};
