from build_classifications import build_classifications
from build_tracker import build_tracker
from build_site_data import build_site_data

def main():
    print("Running full pipeline...")
    build_classifications()
    build_tracker()
    build_site_data()
    print("Done.")

if __name__ == "__main__":
    main()