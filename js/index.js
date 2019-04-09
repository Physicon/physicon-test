if (!Array.prototype.includes) Array.prototype.includes = function(item){
    return this.indexOf(item) >= 0;
}

var app = new Vue({
    el: "#app",
    data: function(){
        return {
            subj: '',
            genre: '',
            grade: '',
            items: [],
            searchText: '',
            priceSelector: 'price'
        }
    },
    methods: {
        classLabel: function(grades){
            if (grades.length == 1) return grades[0] + ' класс'
            return grades[0] + '-' + grades[grades.length-1] + ' классы'
        },
        price: function(item){
            if (this.priceSelector == 'price') return item.price + ' рублей'
            return item.priceBonus + ' бонусов'
        }
    },
    computed: {
        grades: function(){
            let grades = []
            let vm = this;
            for (var i = 0; i < vm.items.length; i++){
                var item = vm.items[i]
                for (var j = 0; j < item.grade.length; j++) {
                    if (!grades.includes(item.grade[j])) grades.push(item.grade[j])
                }
            }
            return grades.sort(function(a,b){
                return a-b
            })
        },
        genres: function(){
            let genres = [];
            let vm = this;
            for (var i = 0; i < vm.items.length; i++){
                var item = vm.items[i]
                if (!genres.includes(item.genre)) genres.push(item.genre)
            }
            return genres.sort()
        },
        subjs: function(){
            let subjs = [];
            let vm = this;
            for (var i = 0; i < vm.items.length; i++){
                var item = vm.items[i]
                if (!subjs.includes(item.subject)) subjs.push(item.subject)
            }
            return subjs.sort()
        },
        filteredItems: function(){
            console.log(this.subj, this.genre, this.grade)
            var vm = this;
            var filtered = vm.items;
            if (vm.subj) filtered = filtered.filter(function(item){
                return item.subject === vm.subj
            })
            if (vm.grade) filtered = filtered.filter(function(item){
                return item.grade.includes(vm.grade)
            })
            if (vm.genre) filtered = filtered.filter(function(item){
                return item.genre === vm.genre
            })
            if (vm.searchText) filtered = filtered.filter(function(item){
                return item.description.toLowerCase().indexOf(vm.searchText.toLowerCase()) >=0 ||
                item.title.toLowerCase().indexOf(vm.searchText.toLowerCase()) >= 0
            })
            return filtered
        }
        
    },
    beforeMount: function(){
        let vm = this;
        axios.post('http://krapipl.imumk.ru:8082/api/mobilev1/update', {data: ''})
        .then(function(response){
            if (response.data.result == 'Ok') {
                vm.items = response.data.items
                for (var i = 0; i < vm.items.length; i++) {
                    vm.items[i].grade = vm.items[i].grade.split(';')
                    for (var j = 0; j < vm.items[i].grade.length; j++) {
                        vm.items[i].grade[j] = +vm.items[i].grade[j]
                    } 
                    vm.items[i].grade = vm.items[i].grade.sort(function(a, b){
                        return a - b
                    })
                }
            }
        })
        .catch(function(error){
            console.error("Could not fetch data")
        })
    }
})