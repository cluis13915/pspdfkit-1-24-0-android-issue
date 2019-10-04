# pspdfkit-1-24-0-android-issue
### Program type already present: com.facebook.device.yearclass.BuildConfig [SOLVED]
    Task :app:transformDexArchiveWithExternalLibsDexMergerForDebug FAILED

    D8: Program type already present: com.facebook.device.yearclass.BuildConfig

    FAILURE: Build failed with an exception.

    * What went wrong:
    Execution failed for task ':app:transformDexArchiveWithExternalLibsDexMergerForDebug'.

    com.android.builder.dexing.DexArchiveMergerException: Error while merging dex archives:

    Program type already present: com.facebook.device.yearclass.BuildConfig

    Learn how to resolve the issue at https://developer.android.com/studio/build/dependencies#duplicate_classes.


### PSPDFKitView doesn't work on Android
No logs. Renders blank view.


# Environment
OS: Linux

react-native: 0.59.8

react-native-pspdfkit: 1.24.0

# Run
```bash
$ yarn install
$ yarn start
$ cd android
$ ./gradlew installDebug
```
