import pandas as pd
from prompt_toolkit import Application
from prompt_toolkit.layout.containers import HSplit, Window 
from prompt_toolkit.buffer import Buffer
from prompt_toolkit.layout.controls import BufferControl, FormattedTextControl
from prompt_toolkit.key_binding import KeyBindings
from prompt_toolkit.layout.layout import Layout
from prompt_toolkit.styles import Style 
from local_data import read_db

ASCII_BANNER = """
   ▄▄▄▄███▄▄▄▄      ▄████████ ███▄▄▄▄      ▄████████  ▄████████    ▄█    █▄       ▄████████  ▄████████    ▄█   ▄█▄ 
 ▄██▀▀▀███▀▀▀██▄   ███    ███ ███▀▀▀██▄   ███    ███ ███    ███   ███    ███     ███    ███ ███    ███   ███ ▄███▀ 
 ███   ███   ███   ███    ███ ███   ███   ███    ███ ███    █▀    ███    ███     ███    █▀  ███    █▀    ███▐██▀   
 ███   ███   ███   ███    ███ ███   ███   ███    ███ ███         ▄███▄▄▄▄███▄▄  ▄███▄▄▄     ███         ▄█████▀    
 ███   ███   ███ ▀███████████ ███   ███ ▀███████████ ███        ▀▀███▀▀▀▀███▀  ▀▀███▀▀▀     ███        ▀▀█████▄    
 ███   ███   ███   ███    ███ ███   ███   ███    ███ ███    █▄    ███    ███     ███    █▄  ███    █▄    ███▐██▄   
 ███   ███   ███   ███    ███ ███   ███   ███    ███ ███    ███   ███    ███     ███    ███ ███    ███   ███ ▀███▄ 
  ▀█   ███   █▀    ███    █▀   ▀█   █▀    ███    █▀  ████████▀    ███    █▀      ██████████ ████████▀    ███   ▀█▀ 
                                                                                                         ▀         
"""

def run_live_search(df):
    # This Buffer holds the text of the search query
    search_buffer = Buffer()

    def get_filtered_data(search_term):
        """Filters the DataFrame based on the search term."""
        if not search_term:
            return df
        
        term_lower = search_term.lower()
        try:
            # Use .apply(..., axis=1) to check each row for a match in any column
            mask = df.astype(str).apply(
                lambda row: row.str.lower().str.contains(term_lower).any(), 
                axis=1
            )
            return df[mask]
        except Exception as e:
            # Handle potential regex errors from special characters
            return pd.DataFrame(columns=df.columns)

    def get_display_text():
        """
        This function is called continuously to get the text for the results window.
        It generates the complete output as a list of (style, text) tuples.
        """
        search_term = search_buffer.text
        filtered_df = get_filtered_data(search_term)
        
        total_rows = len(filtered_df)
        total_data_len = len(df)

        # --- Build the output as a list of (style, text) tuples (the robust format) ---
        formatted_output = []
        
        # 1. Colored Banner (ansiyellow)
        # Split the ASCII_BANNER into lines and assign the style to each line
        for line in ASCII_BANNER.split('\n'):
            if line:
                # Add the line content, plus a newline character
                formatted_output.append(('ansimagenta', line + '\n'))
        
        
        header_text = f"Card Search Results: {total_rows} / {total_data_len} | Ctrl-C to quit"
        formatted_output.append(('italic bold', header_text + '\n')) # Added 'bold' for emphasis
        
        formatted_output.append(('', "\n")) # Spacer

        # 5. DataFrame or No Match Message (unstyled)
        if not filtered_df.empty:
            df_string = filtered_df.to_string(header=True, index=False, max_rows=100, max_cols=2)
            # DataFrame string is added as one unstyled block
            formatted_output.append(('', df_string + '\n'))
        else:
            # "No items" message is colored red
            formatted_output.append(('ansired italic bold', "No items match your search."))
        
        # The FormattedTextControl natively accepts this list of tuples
        return formatted_output

    # 1. The main results window
    # FormattedTextControl handles the list of (style, text) tuples
    results_window = Window(
        content=FormattedTextControl(get_display_text), # Text is dynamically generated
        wrap_lines=False
    )

    def get_prefix(*_):
        """
        Returns the search prompt prefix. 
        Accepts any number of positional arguments (*_) to prevent TypeError 
        as prompt_toolkit's renderer sometimes passes line/column indices.
        """
        return [('class:prompt', '> ')] # Use the 'prompt' style defined below

    # 2. The search prompt window at the bottom
    prompt_window = Window(
        content=BufferControl(buffer=search_buffer, focusable=True),
        height=1,
        get_line_prefix=get_prefix #type: ignore
    )

    # 3. The main layout container (HSplit stacks windows vertically)
    root_container = HSplit([
        results_window, # Results on top
        # Style applied here uses the 'separator' class defined below
        Window(height=1, char='-', style='class:separator'), 
        prompt_window  # Prompt at the bottom
    ])

    layout = Layout(root_container, focused_element=prompt_window)

    kb = KeyBindings()
    
    @kb.add('c-c')
    @kb.add('c-q')
    def _(event):
        """Exit the application on Ctrl-C."""
        event.app.exit()
    # --- Create and Run the Application ---
    
    style_config = Style.from_dict({
        'separator': 'fg:ansimagenta',  
        'prompt': 'fg:ansimagenta bold'
    })

    app = Application(
        layout=layout, 
        key_bindings=kb, 
        full_screen=True, 
        style=style_config # Pass the Style object instance
    )

    def on_text_changed(buffer):
        """Tell the app to redraw when the text changes."""
        app.invalidate()

    # Link the text change event to the redraw function
    search_buffer.on_text_changed += on_text_changed

    print("Running Manacheck...")
    app.run()


if __name__ == "__main__":
       # Load the global data
    all_data = read_db()
    
    run_live_search(all_data)