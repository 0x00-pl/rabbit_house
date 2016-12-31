let expect = require("expect.js");
let print_routes = require("../print_routes.js");

describe('print_routes', function(){
    it('print', function(){
        function App(){}
        function Inbox(){}
        function Dashboard(){}
        function About(){}
        function Message(){}

        const routes = {
            path: '/',
            component: App,
            indexRoute: { component: Dashboard },
            childRoutes: [
                { path: 'about', component: About },
                {
                    path: 'inbox',
                    component: Inbox,
                    childRoutes: [{
                        path: 'messages/:id',
                        onEnter: ({ params }, replace) => replace(`/messages/${params.id}`)
                    }]
                },
                {
                    component: Inbox,
                    childRoutes: [{
                        path: 'messages/:id', component: Message
                    }]
                }
            ]
        };

        let route_result = print_routes.printRouteToString(routes);
        let result_str = [
            "+---------------------+----------------------+",
            "| Path                | Name                 |",
            "+---------------------+----------------------+",
            "| /                   | function App(){}     |",
            "| /                   | function Inbox(){}   |",
            "| /about              | function About(){}   |",
            "| /inbox              | function Inbox(){}   |",
            "| /inbox/messages/:id | undefined            |",
            "| /messages/:id       | function Message(){} |",
            "+---------------------+----------------------+",
        ].join('\n');
        console.log(route_result);

        expect(route_result).eql(result_str);
    });
});
