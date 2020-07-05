const createAutoCompleteWidget = ({
                                      root,
                                      renderOption,
                                      onOptionSelect,
                                      inputValue,
                                      fetchData
}) => {
    root.innerHTML = `
    <label><b>Search</b></label>
        <input type="text" class="input"/>
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results">                
                </div>
            </div>
        </div>
`
    const input = root.querySelector(".input")
    const dropdown = root.querySelector(".dropdown")
    const resultsWrapper = root.querySelector(".results")


    const onInput = async ev => {
        const items = await fetchData(ev.target.value);
        if (!items.length) {
            dropdown.classList.remove("is-active");
            return;
        }
        resultsWrapper.innerHTML = "";
        dropdown.classList.add("is-active");
        for (let item of items) {
            const anchorElementOption = document.createElement("a");


            anchorElementOption.classList.add("dropdown-item")
            anchorElementOption.innerHTML = renderOption(item);
            anchorElementOption.addEventListener('click', () => {
                dropdown.classList.remove("is-active");
                input.value = inputValue(item);
                onOptionSelect(item);
            })

            resultsWrapper.appendChild(anchorElementOption);
        }
    }
    input.addEventListener('input', debounce(onInput, 500))
    document.addEventListener('click', (ev) => {
        if (!root.contains(ev.target)) {
            dropdown.classList.remove("is-active");
        }
    })
}
