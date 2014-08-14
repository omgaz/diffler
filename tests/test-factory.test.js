describe("TestFactoryTester", function() {
    var f = TestFactory.testObject;
 
    beforeEach(function(){
        spyOn(f, 'init').andCallThrough();
    });
 
    afterEach(function() {
        f.reset();
    });
 
    it("should be able to initialize", function() {
        expect(f.init).toBeDefined();
        f.init();
        expect(f.init).toHaveBeenCalled();
    });
 
    it("should initialise an empty object", function(){
        f.init();
        expect(typeof f.obj).toEqual("object");
        expect(f.isEmpty()).toEqual(true);
    });

    it("should add to object", function(){
        f.init();
        f.add("firstName", "Gary");

        expect(f.isEmpty()).toEqual(false);
        expect(f.obj.firstName).toBeDefined();
        expect(f.obj.firstName).toEqual("Gary");
    });

    it("should remove from the object", function(){
        f.init();
        f.add("firstName", "Gary");

        expect(f.isEmpty()).toEqual(false);
        expect(f.obj.firstName).toBeDefined();
        expect(f.obj.firstName).toEqual("Gary");

        f.remove("firstName");

        expect(f.isEmpty()).toEqual(true);
        expect(f.obj.firstName).toBeUndefined();
    });
});