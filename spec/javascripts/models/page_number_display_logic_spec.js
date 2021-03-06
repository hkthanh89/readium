describe("Readium.Models.PageNumberDisplayLogic", function () {

    describe("going to pages", function () {

        beforeEach(function () {
            this.pageNumSelector = new Readium.Models.PageNumberDisplayLogic();

            // Rationale: This function will make these sets of repetitive tests clearer - as in, the conditions of the 
            //   EPUB, the page to go to and the expected result.
            this.testGetPageNumber = function (params) {

                var selectedPageNums = this.pageNumSelector.getGotoPageNumsToDisplay(
                    params.goToPage, 
                    params.twoUp, // two pages displayed?
                    params.isFXL, // is FXL? 
                    params.pageProgDir, // page prog. direction
                    params.firstPageOffset // first page offset
                    );

                return selectedPageNums;
            };
        });

        // gotoPageNumber, twoUp (x2), isFixedLayout (x2), pageProgDirection (x2), orientation of the page (x3)
        describe("1 page displayed", function () {

            it ("gets selected page number when LTR", function () {
                var pageNums = this.testGetPageNumber({ twoUp : false, isFXL : false, pageProgDir : "ltr", firstPageOffset : false,
                    goToPage : 1});
            
                expect(pageNums).toEqual([1]);
            });

            it ("gets selected page number when RTL", function () {
                var pageNums = this.testGetPageNumber({ twoUp : false, isFXL : false, pageProgDir : "rtl", firstPageOffset : false,
                    goToPage : 1});
            
                expect(pageNums).toEqual([1]);
            });
        });

        describe("2 pages displayed", function () {

            describe("reflowable", function () {

                it("gets 2 page numbers; LTR; go to p in [p, p+1]", function () {
                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : false, pageProgDir : "ltr", firstPageOffset : false,
                        goToPage : 1});
                
                    expect(pageNums).toEqual([1, 2]);
                });

                it("gets 2 page numbers; RTL; go to p in [p+1, p]", function () {
                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : false, pageProgDir : "rtl", firstPageOffset : false,
                        goToPage : 1});
                
                    expect(pageNums).toEqual([1, 2]);
                });

                it("gets 2 page numbers; LTR; go to p+1 in [p, p+1]", function () {
                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : false, pageProgDir : "ltr", firstPageOffset : false,
                        goToPage : 2});
                
                    expect(pageNums).toEqual([1, 2]);
                });

                it("gets 2 page numbers; RTL; go to p+1 in [p+1, p]", function () {
                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : false, pageProgDir : "rtl", firstPageOffset : false,
                        goToPage : 2});
                
                    expect(pageNums).toEqual([1, 2]);
                });

                // Still have all the offset pages here
            });

            describe("fixed layout", function () {

                // ltr
                it("gets page numbers; LTR; go to p in [p, p+1], p is left, p+1 is left", function () {

                    spyOn(this.pageNumSelector, "displayedPageIsLeft").andCallFake(function (pageNum) {
                        return pageNum === 1 || pageNum === 2 ? true : false; });
                    spyOn(this.pageNumSelector, "displayedPageIsRight").andReturn(false);

                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : true, pageProgDir : "ltr", firstPageOffset : false,
                        goToPage : 1});
                
                    expect(pageNums).toEqual([1]);
                });

                it("gets page numbers; LTR; go to p in [p, p+1], p is left, p+1 is right", function () {

                    spyOn(this.pageNumSelector, "displayedPageIsLeft").andCallFake(function (pageNum) {
                        return pageNum === 1 ? true : false; });
                    spyOn(this.pageNumSelector, "displayedPageIsRight").andCallFake(function (pageNum) {
                        return pageNum === 2 ? true : false; });

                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : true, pageProgDir : "ltr", firstPageOffset : false,
                        goToPage : 1});
                
                    expect(pageNums).toEqual([1, 2]);
                });

                it("gets page numbers; LTR; go to p in [p, p+1], p is right, p+1 is right", function () {

                    spyOn(this.pageNumSelector, "displayedPageIsLeft").andReturn(false);
                    spyOn(this.pageNumSelector, "displayedPageIsRight").andCallFake(function (pageNum) {
                        return pageNum === 1 || pageNum === 2 ? true : false; });

                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : true, pageProgDir : "ltr", firstPageOffset : false,
                        goToPage : 1});
                
                    expect(pageNums).toEqual([1]);
                });

                it("gets page numbers; LTR; go to p in [p, p+1], p is center", function () {

                    spyOn(this.pageNumSelector, "displayedPageIsCenter").andCallFake(function (pageNum) {
                        return pageNum === 1 ? true : false; });

                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : true, pageProgDir : "ltr", firstPageOffset : false,
                        goToPage : 1});
                
                    expect(pageNums).toEqual([1]);
                });

                it("gets page numbers; LTR; go to p+1 in [p, p+1], p+1 is right, p is left", function () {

                    spyOn(this.pageNumSelector, "displayedPageIsRight").andCallFake(function (pageNum) {
                        return pageNum === 2 ? true : false; });
                    spyOn(this.pageNumSelector, "displayedPageIsLeft").andCallFake(function (pageNum) {
                        return pageNum === 1 ? true : false; });

                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : true, pageProgDir : "ltr", firstPageOffset : false,
                        goToPage : 2});
                
                    expect(pageNums).toEqual([1, 2]);
                });
            
                it("gets page numbers; LTR; go to p+1 in [p, p+1], p+1 is right, p is right", function () {

                    spyOn(this.pageNumSelector, "displayedPageIsRight").andCallFake(function (pageNum) {
                        return pageNum === 2 || pageNum === 2 ? true : false; });

                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : true, pageProgDir : "ltr", firstPageOffset : false,
                        goToPage : 2});
                
                    expect(pageNums).toEqual([2]);
                });

                it("gets page numbers; LTR; go to p+1 in [p, p+1], p+1 is center", function () {

                    spyOn(this.pageNumSelector, "displayedPageIsCenter").andCallFake(function (pageNum) {
                        return pageNum === 2 ? true : false; });

                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : true, pageProgDir : "ltr", firstPageOffset : false,
                        goToPage : 2});
                
                    expect(pageNums).toEqual([2]);
                });

                it("gets page numbers; RTL; go to p in [p+1, p], p is right, p+1 is left", function () {

                    spyOn(this.pageNumSelector, "displayedPageIsRight").andCallFake(function (pageNum) {
                        return pageNum === 1 ? true : false; });
                    spyOn(this.pageNumSelector, "displayedPageIsLeft").andCallFake(function (pageNum) {
                        return pageNum === 2 ? true : false; });

                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : true, pageProgDir : "rtl", firstPageOffset : false,
                        goToPage : 1});
                
                    expect(pageNums).toEqual([1, 2]);
                });

                it("gets page numbers; RTL; go to p in [p+1, p], p is right, p+1 is right", function () {

                    spyOn(this.pageNumSelector, "displayedPageIsRight").andCallFake(function (pageNum) {
                        return pageNum === 1 || pageNum === 2 ? true : false; });

                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : true, pageProgDir : "rtl", firstPageOffset : false,
                        goToPage : 1});
                
                    expect(pageNums).toEqual([1]);
                });

                it("gets page numbers; RTL; go to p in [p+1, p], p is center", function () {

                    spyOn(this.pageNumSelector, "displayedPageIsCenter").andCallFake(function (pageNum) {
                        return pageNum === 1 ? true : false; });

                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : true, pageProgDir : "rtl", firstPageOffset : false,
                        goToPage : 1});
                
                    expect(pageNums).toEqual([1]);
                });

                it("gets page numbers; RTL; go to p+1 in [p+1, p], p+1 is left, p is left", function () {

                    spyOn(this.pageNumSelector, "displayedPageIsLeft").andCallFake(function (pageNum) {
                        return pageNum === 1 || pageNum === 2 ? true : false; });

                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : true, pageProgDir : "rtl", firstPageOffset : false,
                        goToPage : 2});
                
                    expect(pageNums).toEqual([2]);
                });

                it("gets page numbers; RTL; go to p+1 in [p+1, p], p+1 is left, p is right", function () {

                    spyOn(this.pageNumSelector, "displayedPageIsLeft").andCallFake(function (pageNum) {
                        return pageNum === 2 ? true : false; });
                    spyOn(this.pageNumSelector, "displayedPageIsRight").andCallFake(function (pageNum) {
                        return pageNum === 1 ? true : false; });

                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : true, pageProgDir : "rtl", firstPageOffset : false,
                        goToPage : 2});
                
                    expect(pageNums).toEqual([1, 2]);
                });

                it("gets page numbers; RTL; go to p+1 in [p+1, p], p+1 is center", function () {

                    spyOn(this.pageNumSelector, "displayedPageIsCenter").andCallFake(function (pageNum) {
                        return pageNum === 2 ? true : false; });

                    var pageNums = this.testGetPageNumber({ twoUp : true, isFXL : true, pageProgDir : "rtl", firstPageOffset : false,
                        goToPage : 2});
                
                    expect(pageNums).toEqual([2]);
                });
            });
        });
    });

    describe("getting previous page", function () {


    });

    describe("getting next page", function () {


    });

    describe("toggling two-up pages", function () {


    });
});